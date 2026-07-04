export interface User {
  id: number;
  email: string;
  password_hash: string;
  display_name: string;
  verified: boolean;
  verification_method: 'email' | 'phone';
  created_at: string;
}

export interface Task {
  id: number;
  sponsor_id: number;
  title: string;
  description: string;
  task_type: 'survey' | 'app_test' | 'promo_action' | 'other';
  effort_minutes: number;
  payout_cad: number;
  deadline: string | null;
  max_completions: number;
  current_completions: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  created_at: string;
}

export interface TaskCompletion {
  id: number;
  task_id: number;
  user_id: number;
  proof_data: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'flagged';
  reviewer_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface EarningsLedger {
  id: number;
  user_id: number;
  task_completion_id: number;
  amount_cad: number;
  status: 'pending' | 'cleared' | 'paid';
  created_at: string;
  released_at: string | null;
}

export interface PayoutRequest {
  id: number;
  user_id: number;
  paypal_email: string;
  amount_cad: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reviewer_notes: string | null;
  requested_at: string;
  processed_at: string | null;
}

export interface FraudFlag {
  id: number;
  user_id: number;
  flag_type: 'velocity' | 'device_mismatch' | 'ip_anomaly' | 'manual' | 'pattern';
  severity: 'low' | 'medium' | 'high';
  details: string;
  created_at: string;
  resolved: boolean;
}

export interface AuthPayload {
  userId: number;
  email: string;
}

export interface SponsorEarning {
  id: number;
  user_id: number;
  network: string;
  external_tx_id: string;
  external_offer_id: string;
  amount_cad: number;
  status: "cleared" | "reversed";
  created_at: string;
}