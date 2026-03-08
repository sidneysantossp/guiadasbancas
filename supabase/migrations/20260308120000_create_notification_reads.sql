CREATE TABLE IF NOT EXISTS notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_key VARCHAR(255) NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, notification_key)
);

CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON notification_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_reads_notification_key ON notification_reads(notification_key);

ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification reads" ON notification_reads
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own notification reads" ON notification_reads
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notification reads" ON notification_reads
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Notification reads editable by service role" ON notification_reads
  FOR ALL
  USING (auth.role() = 'service_role');
