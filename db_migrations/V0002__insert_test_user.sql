INSERT INTO t_p58262826_telegram_like_messen.users (name, email, password_hash)
VALUES ('Тест Юзер', 'test_neochat_42@example.com', '6025d18fe48abd45168528f18a82e265dd98d421240ef466d925c3cc1ac1e71')
ON CONFLICT (email) DO NOTHING;
