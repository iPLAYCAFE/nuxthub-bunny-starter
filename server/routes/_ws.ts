/**
 * WebSocket handler — CrossWS (Nitro built-in).
 *
 * NOTE: CrossWS pub/sub is **in-memory per server instance**.
 * `peer.publish()` only reaches peers connected to the same process.
 * This works perfectly for a single-replica deployment on Magic Containers.
 *
 * For multi-replica scaling, you would need an external message broker
 * (e.g. Redis pub/sub bridge, Ably, or Rivet Actors) to relay messages
 * across instances. See: https://crossws.h3.dev/guide/pubsub
 */
export default defineWebSocketHandler({
  open(peer) {
    peer.send(JSON.stringify({
      type: 'connected',
      message: 'Welcome to NuxtHub × bunny.net WebSocket',
      peerId: peer.id
    }))
    // Subscribe to in-memory broadcast channel (single instance only)
    peer.subscribe('broadcast')
  },

  message(peer, message) {
    try {
      const data = message.text()
      // Broadcast to all peers in this server instance (in-memory, not cross-replica)
      peer.publish('broadcast', JSON.stringify({
        type: 'message',
        from: peer.id,
        data,
        timestamp: new Date().toISOString()
      }))
    } catch {
      peer.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }))
    }
  },

  close(peer) {
    peer.publish('broadcast', JSON.stringify({
      type: 'disconnected',
      peerId: peer.id
    }))
  }
})
