'use client';
import { Suspense } from 'react';
import OrderConfirmContent from './order-confirm-content';

export default function OrderConfirm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-graphite-900 flex items-center justify-center text-white">Loading...</div>}>
      <OrderConfirmContent />
    </Suspense>
  );
}