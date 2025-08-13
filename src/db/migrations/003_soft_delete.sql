-- 論理削除用カラムを追加（0=表示、1=削除）
ALTER TABLE todos ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0;
