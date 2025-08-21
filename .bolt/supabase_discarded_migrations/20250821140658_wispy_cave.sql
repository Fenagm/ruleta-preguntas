/*
  # Create custom questions table

  1. New Tables
    - `custom_questions`
      - `id` (uuid, primary key)
      - `question` (text, the question content)
      - `category` (text, the category name)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `custom_questions` table
    - Add policy for authenticated users to manage their own questions
    - Add policy for anonymous users to manage questions in their session
*/

CREATE TABLE IF NOT EXISTS custom_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  session_id text
);

ALTER TABLE custom_questions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their own questions
CREATE POLICY "Users can manage own questions"
  ON custom_questions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for anonymous users to manage questions in their session
CREATE POLICY "Anonymous users can manage session questions"
  ON custom_questions
  FOR ALL
  TO anon
  USING (session_id = current_setting('app.session_id', true))
  WITH CHECK (session_id = current_setting('app.session_id', true));

-- Index for better performance
CREATE INDEX IF NOT EXISTS custom_questions_user_id_idx ON custom_questions(user_id);
CREATE INDEX IF NOT EXISTS custom_questions_session_id_idx ON custom_questions(session_id);