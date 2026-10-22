/**
 * Types for the Subscription system and Channels.
 */

export type SubscriptionPlanId =
  | 'journey_3000'
  | 'journey_5000'
  | 'vip_signals'
  | 'private_mentorship'
  | string;

export interface PaymentMethodItem {
  id: string;
  name: string;
  type: 'crypto' | 'wallet' | 'bank' | string;
  network?: string;
  addressOrDetails?: string;
  linkUrl?: string;
  instructions?: string;
  qrCodeUrl?: string;
  isEnabled: boolean;
}

export interface TermsItem {
  id: string;
  order: number;
  title: string;
  content: string;
  isEnabled: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  currency: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  coverImageUrl?: string;
  depositNetwork?: string;
  walletAddress?: string;
  walletLink?: string;
  features: string[];
  paymentMethods: PaymentMethodItem[];
  allowsInstallments?: boolean;
  installmentMinimum?: number;
  durationDays: number;
  maxSubscribers: number;
  enrolledCount?: number;
  isActive: boolean;
  status: 'active' | 'closed' | 'paused' | 'archived' | string;
  closedMessage?: string;
  termsTitle?: string;
  termsItems: TermsItem[];
  termsFullText?: string;
  termsVersion: number;
  paymentInstructions?: string;
  ownerNotes?: string;
  publishedAt?: number;
  updatedAt?: number;
  updatedBy?: number | string;
  installmentsAvailable?: boolean;
  notes?: string;
  highlightBadge?: string;
}

export interface SubscriptionAuditLog {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  changeType:
    | 'details_update'
    | 'price_update'
    | 'publish'
    | 'archive'
    | 'terms_update'
    | 'payment_method_update'
    | string;
  summary: string;
  previousData?: Partial<SubscriptionPlan>;
  newData?: Partial<SubscriptionPlan>;
  changedBy: number;
  changedByName: string;
  timestamp: number;
}

export interface SubscriptionConsent {
  id: string;
  userId: number;
  userName: string;
  subscriptionId: string;
  subscriptionName: string;
  termsVersion: number;
  agreedAt: number;
  timestamp: number;
  status: 'active' | 'revoked' | string;
}
