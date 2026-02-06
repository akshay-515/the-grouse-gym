CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    age INT,
    gender VARCHAR(10),
    joined_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memberships (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    plan_type VARCHAR(20) NOT NULL CHECK (
        plan_type IN ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY')
    ),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode VARCHAR(10) NOT NULL CHECK (
        payment_mode IN ('CASH', 'GPAY', 'UPI')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT
  m.id,
  mem.name,
  CASE
    WHEN m.end_date < CURRENT_DATE THEN 'EXPIRED'
    WHEN m.end_date <= CURRENT_DATE + INTERVAL '7 days'
         THEN 'EXPIRING_SOON'
    ELSE 'ACTIVE'
  END AS membership_status
FROM memberships m
JOIN members mem ON mem.id = m.member_id;


CREATE VIEW membership_status_view AS
SELECT
  m.member_id,
  m.start_date,
  m.end_date,
  CASE
    WHEN m.end_date < CURRENT_DATE THEN 'EXPIRED'
    WHEN m.end_date <= CURRENT_DATE + INTERVAL '7 days'
         THEN 'EXPIRING_SOON'
    ELSE 'ACTIVE'
  END AS status
FROM memberships m;

CREATE INDEX idx_members_phone ON members(phone);
CREATE INDEX idx_memberships_member_id ON memberships(member_id);
CREATE INDEX idx_memberships_end_date ON memberships(end_date);
CREATE INDEX idx_payments_member_id ON payments(member_id);
