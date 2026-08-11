'use client';
import { Suspense } from 'react';
import OrderConfirmContent from './order-confirm-content';

export default function OrderConfirm() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-white">Loading...</div>}>
      <OrderConfirmContent />
    </Suspense>
  );
}