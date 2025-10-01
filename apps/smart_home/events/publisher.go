package events

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"strings"
	"time"

	kafka "github.com/segmentio/kafka-go"
)

// Publisher is a minimal interface for publishing domain events
// onto an asynchronous transport (Kafka).
// It allows decoupled handlers to consume changes in smart_home.
type Publisher interface {
	Publish(ctx context.Context, eventType string, payload any) error
	Close() error
}

// KafkaPublisher implements Publisher using kafka-go writer.
type KafkaPublisher struct {
	writer *kafka.Writer
	topic  string
}

// NewKafkaPublisher creates a KafkaPublisher from env or provided params.
// brokers: comma-separated host:port list; topic: target topic name.
func NewKafkaPublisher(brokers, topic string) *KafkaPublisher {
	if brokers == "" {
		brokers = os.Getenv("KAFKA_BROKERS")
	}
	if topic == "" {
		topic = os.Getenv("KAFKA_TOPIC")
	}
	if topic == "" {
		topic = "sensor.events"
	}
	var addrs []string
	for _, b := range strings.Split(brokers, ",") {
		b = strings.TrimSpace(b)
		if b != "" {
			addrs = append(addrs, b)
		}
	}
	if len(addrs) == 0 {
		// provide sensible default for local compose network
		addrs = []string{"kafka:9092"}
	}

	writer := &kafka.Writer{
		Addr:         kafka.TCP(addrs...),
		Topic:        topic,
		BatchSize:    1, // publish immediately, events are infrequent
		RequiredAcks: kafka.RequireOne,
		Async:        true,
		Balancer:     &kafka.LeastBytes{},
	}

	return &KafkaPublisher{writer: writer, topic: topic}
}

// eventEnvelope for consistent schema expected by consumers.
type eventEnvelope struct {
	Type    string `json:"type"`
	Payload any    `json:"payload,omitempty"`
}

func (p *KafkaPublisher) Publish(ctx context.Context, eventType string, payload any) error {
	if p == nil || p.writer == nil {
		return nil // no-op if publisher not configured
	}
	env := eventEnvelope{Type: eventType, Payload: payload}
	b, err := json.Marshal(env)
	if err != nil {
		return err
	}
	// add timeout to avoid hanging requests
	c, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	msg := kafka.Message{Value: b}
	if err := p.writer.WriteMessages(c, msg); err != nil {
		log.Printf("KafkaPublisher: failed to publish event %s: %v", eventType, err)
		return err
	}
	return nil
}

func (p *KafkaPublisher) Close() error {
	if p == nil || p.writer == nil {
		return nil
	}
	return p.writer.Close()
}
