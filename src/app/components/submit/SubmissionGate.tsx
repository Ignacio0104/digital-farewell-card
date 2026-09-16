"use client";

import { useState, useTransition, type FormEvent } from "react";
import { verifyPasscode } from "@/lib/actions/messages";
import MessageForm from "../admin/MessageForm";
interface SubmissionGateProps {
  cardId: string;
  recipientName: string;
}

export default function SubmissionGate({
  cardId,
  recipientName,
}: SubmissionGateProps) {
  return <MessageForm cardId={cardId} recipientName={recipientName} />;
}
