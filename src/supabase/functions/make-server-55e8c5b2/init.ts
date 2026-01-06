import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.ts'
import { 
  DEMO_ACCOUNTS, 
  STORAGE_BUCKETS, 
  SAMPLE_INCIDENTS, 
  SAMPLE_ASSESSMENTS, 
  AI_LEARNING_METRICS 
} from './constants.ts'

// Create Supabase client for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Initialize storage buckets for intelligence data
export async function initializeStorageBuckets() {
  try {
    const { data: existingBuckets } = await supabase.storage.listBuckets()
    
    for (const bucketName of STORAGE_BUCKETS) {
      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName)
      
      if (!bucketExists) {
        const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024 // 50MB for intelligence data
        })
        if (bucketError) {
          console.error(`Bucket creation error for ${bucketName}:`, bucketError)
        } else {
          console.log(`✅ Created intelligence bucket: ${bucketName}`)
        }
      }
    }
  } catch (error) {
    console.error('Storage bucket initialization error:', error)
  }
}

// Initialize AI intelligence data
export async function initializeIntelligenceData() {
  try {
    console.log('Initializing BuboIQ AI Intelligence data...')
    
    // Initialize demo intelligence analysts
    for (const analyst of DEMO_ACCOUNTS) {
      await kv.set(`user:${analyst.id}`, analyst)
      await kv.set(`user_email:${analyst.email}`, analyst.id)
    }
    
    // Initialize sample incidents for AI analysis
    for (const incident of SAMPLE_INCIDENTS) {
      await kv.set(`incident:${incident.id}`, incident)
    }
    
    // Initialize intelligence assessments
    for (const assessment of SAMPLE_ASSESSMENTS) {
      await kv.set(`assessment:${assessment.id}`, assessment)
    }
    
    // Initialize AI learning metrics
    await kv.set('ai_metrics', AI_LEARNING_METRICS)
    
    console.log('✅ AI Intelligence data initialized successfully')
    console.log(`📊 ${DEMO_ACCOUNTS.length} intelligence analysts loaded`)
    console.log(`🎯 ${SAMPLE_INCIDENTS.length} sample incidents loaded`)
    console.log(`🧠 ${SAMPLE_ASSESSMENTS.length} AI assessments loaded`)
  } catch (error) {
    console.error('Intelligence data initialization error:', error)
    throw error
  }
}
