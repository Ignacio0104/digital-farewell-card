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
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (unlocked) {
  }

  return (
    <MessageForm
      cardId={cardId}
      recipientName={recipientName}
      passcode={passcode}
    />
  );
}
