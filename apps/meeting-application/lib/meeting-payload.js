const splitList = (value) =>
  Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : String(value ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

export function normalizeMeetingPayload(payload) {
  return {
    actionItems: splitList(payload.actionItems),
    agenda: String(payload.agenda ?? '').trim(),
    attendees: splitList(payload.attendees),
    endTime: payload.endTime,
    location: String(payload.location ?? '').trim(),
    mode: payload.mode,
    ownerName: String(payload.ownerName ?? '').trim(),
    startTime: payload.startTime,
    status: payload.status,
    summary: String(payload.summary ?? '').trim(),
    tags: splitList(payload.tags),
    title: String(payload.title ?? '').trim(),
    virtualLink: String(payload.virtualLink ?? '').trim(),
  };
}
