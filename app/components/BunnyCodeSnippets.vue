<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
    <!-- Edge Scripting -->
    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0' }"
    >
      <div class="h-11 px-4 flex items-center gap-2 border-b border-(--ui-border)">
        <UIcon
          name="i-lucide-zap"
          class="w-4 h-4 text-[#FD8D32]"
        />
        <span class="text-sm font-mono text-muted">{{ t('codeSnippets.edge_label') }}</span>
      </div>
      <pre class="p-4 text-xs font-mono text-muted overflow-x-auto"><code>{{ edgeCode }}</code></pre>
      <div class="px-4 pb-4 flex flex-wrap gap-1.5">
        <UBadge
          label="Deno"
          size="xs"
          color="warning"
          variant="subtle"
        />
        <UBadge
          label="TypeScript"
          size="xs"
          color="warning"
          variant="subtle"
        />
        <UBadge
          label="100+ PoPs"
          size="xs"
          color="warning"
          variant="subtle"
        />
      </div>
    </UPageCard>

    <!-- DNS -->
    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0' }"
    >
      <div class="h-11 px-4 flex items-center gap-2 border-b border-(--ui-border)">
        <UIcon
          name="i-lucide-globe"
          class="w-4 h-4 text-[#FD8D32]"
        />
        <span class="text-sm font-mono text-muted">{{ t('codeSnippets.dns_label') }}</span>
      </div>
      <pre class="p-4 text-xs font-mono text-muted overflow-x-auto"><code>{{ dnsCode }}</code></pre>
      <div class="px-4 pb-4 flex flex-wrap gap-1.5">
        <UBadge
          label="GeoDNS"
          size="xs"
          color="warning"
          variant="subtle"
        />
        <UBadge
          label="DNSSEC"
          size="xs"
          color="warning"
          variant="subtle"
        />
        <UBadge
          label="Scriptable"
          size="xs"
          color="warning"
          variant="subtle"
        />
      </div>
    </UPageCard>

    <!-- Shield WAF -->
    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0' }"
    >
      <div class="h-11 px-4 flex items-center gap-2 border-b border-(--ui-border)">
        <UIcon
          name="i-lucide-shield-check"
          class="w-4 h-4 text-[#FD8D32]"
        />
        <span class="text-sm font-mono text-muted">{{ t('codeSnippets.shield_label') }}</span>
      </div>
      <pre class="p-4 text-xs font-mono text-muted overflow-x-auto"><code>{{ shieldCode }}</code></pre>
      <div class="px-4 pb-4 flex flex-wrap gap-1.5">
        <UBadge
          label="WAF"
          size="xs"
          color="warning"
          variant="subtle"
        />
        <UBadge
          label="DDoS"
          size="xs"
          color="warning"
          variant="subtle"
        />
        <UBadge
          label="Bot Detection"
          size="xs"
          color="warning"
          variant="subtle"
        />
      </div>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const shieldCode = `# Shield WAF — API config
curl -X GET \\
  https://api.bunny.net/shield \\
    /waf/engine-config \\
  -H "AccessKey: $BUNNY_API_KEY"

# Custom WAF rule
curl -X PATCH \\
  https://api.bunny.net/shield \\
    /waf/custom-rule/{ruleId} \\
  -H "AccessKey: $BUNNY_API_KEY" \\
  -d '{
    "ruleName": "Block SQL Injection",
    "actionType": 1,
    "triggerMatchingType": 0
  }'`

const dnsCode = `# Create DNS record
curl -X POST \\
  https://api.bunny.net \\
    /dnszone/{zoneId}/records \\
  -H "AccessKey: $BUNNY_API_KEY" \\
  -d '{
    "Type": 0,
    "Name": "app",
    "Value": "container.b-cdn.net",
    "Ttl": 300
  }'

# Enable DNSSEC
curl -X POST \\
  https://api.bunny.net \\
    /dnszone/{zoneId}/dnssec \\
  -H "AccessKey: $BUNNY_API_KEY"`

const edgeCode = `// Bunny Edge Script (TypeScript)
// Runs on 100+ PoPs worldwide

export default {
  async fetch(
    request: Request
  ): Promise<Response> {
    const country = request
      .headers.get("X-Bunny-Country")

    // Geo-based routing
    if (country === "TH")
      return Response.redirect(
        "https://th.example.com"
      )

    return fetch(request)
  }
}`
</script>
