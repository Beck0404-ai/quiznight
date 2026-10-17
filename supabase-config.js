// Supabase Cloud Sync Configuration
// Project URL: https://iiybfbllhnklczhjiqts.supabase.co

const SUPABASE_CONFIG = {
  url: "https://iiybfbllhnklczhjiqts.supabase.co",
  // If you have your anon key, you can paste it here or enter it via the app UI
  anonKey: "" 
};

class SupabaseSync {
  constructor() {
    this.url = SUPABASE_CONFIG.url;
    this.anonKey = localStorage.getItem('sdy_supabase_anon_key') || SUPABASE_CONFIG.anonKey;
    this.client = null;
    this.isReady = false;
    this.init();
  }

  init() {
    if (this.anonKey && this.anonKey.trim() !== '') {
      if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        try {
          this.client = window.supabase.createClient(this.url, this.anonKey.trim());
          this.isReady = true;
          console.log('✅ Supabase connected:', this.url);
        } catch (e) {
          console.error('❌ Supabase init error:', e);
          this.isReady = false;
        }
      } else {
        console.warn('⚠️ Supabase JS library not loaded yet');
      }
    }
  }

  setAnonKey(key) {
    if (!key) return;
    this.anonKey = key.trim();
    localStorage.setItem('sdy_supabase_anon_key', this.anonKey);
    this.init();
    if (this.isReady && window.app) {
      window.app.syncFromSupabase();
    }
  }

  async loadState() {
    if (!this.isReady || !this.client) return null;
    try {
      const { data, error } = await this.client
        .from('quiz_state')
        .select('*')
        .eq('id', 'active_game')
        .maybeSingle();

      if (error) {
        console.warn('Supabase loadState error:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
      return null;
    }
  }

  async saveState(payload) {
    if (!this.isReady || !this.client) return;
    try {
      const row = {
        id: 'active_game',
        current_slide: payload.currentSlideIndex,
        teams: payload.teams,
        revealed_answers: payload.revealedAnswers,
        chosen_options: payload.chosenOptions,
        updated_at: new Date().toISOString()
      };

      const { error } = await this.client
        .from('quiz_state')
        .upsert(row);

      if (error) {
        console.warn('Supabase saveState error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
  }

  subscribeToChanges(callback) {
    if (!this.isReady || !this.client) return;
    try {
      this.client
        .channel('quiz_state_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_state' }, payload => {
          if (payload.new && callback) {
            callback(payload.new);
          }
        })
        .subscribe();
    } catch (e) {
      console.warn('Supabase realtime error:', e);
    }
  }
}

const supabaseSync = new SupabaseSync();
