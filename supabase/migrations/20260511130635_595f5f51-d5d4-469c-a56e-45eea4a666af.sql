SELECT cron.unschedule('check-domain-status-hourly') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname='check-domain-status-hourly');
SELECT cron.schedule(
  'check-domain-status-hourly',
  '*/30 * * * *',
  $$
  SELECT net.http_post(
    url:='https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/check-domain-status',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZ3Jua3VocHJ4b3djdnlkbnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTc5NDcsImV4cCI6MjA3MjI5Mzk0N30.q2wxy651XYiuQzJny06bL1Xlp337KCD5rBIp-YGQxxQ"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);