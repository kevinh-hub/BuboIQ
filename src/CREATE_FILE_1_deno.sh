#!/bin/bash
cat > deno.json << 'EOF'
{
  "imports": {
    "hono": "npm:hono@^4.0.0",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@2"
  },
  "compilerOptions": {
    "lib": ["deno.ns", "dom"]
  }
}
EOF
echo "✅ Created deno.json"
