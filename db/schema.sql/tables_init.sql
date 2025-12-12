CREATE TABLE COMPANY (
    company_name VARCHAR(50) NOT NULL,
    address VARCHAR(200) NOT NULL,
    url VARCHAR(200) NULL,
    PRIMARY KEY (company_name)
);
CREATE TABLE USER (
    phone_number VARCHAR(16) NOT NULL,
    password VARCHAR(16) NOT NULL,
    user_name VARCHAR(10) NOT NULL,
    PRIMARY KEY (phone_number),
    CONSTRAINT chk_user_phone CHECK (phone_number REGEXP '^[0-9]+$'),
    CONSTRAINT chk_user_pw CHECK (
        CHAR_LENGTH(password) >= 8 
        AND NOT REGEXP_LIKE(password, '[A-Z]', 'c') 
        AND NOT REGEXP_LIKE(password, '[_./, ]') 
        AND REGEXP_LIKE(password, '[a-z]', 'c') 
        AND REGEXP_LIKE(password, '[0-9]') 
        AND REGEXP_LIKE(password, '[^a-z0-9]', 'c')
    )
);
CREATE TABLE ADMIN (
    id VARCHAR(16) NOT NULL,
    password VARCHAR(16) NOT NULL,
    company_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_admin_company FOREIGN KEY (company_name) 
        REFERENCES COMPANY (company_name) ON DELETE CASCADE ON 
UPDATE CASCADE,
    CONSTRAINT chk_admin_id CHECK (
        CHAR_LENGTH(id) >= 8 
        AND NOT REGEXP_LIKE(id, '[A-Z]', 'c') 
        AND NOT REGEXP_LIKE(id, '[_./, ]') 
        AND REGEXP_LIKE(id, '[a-z]', 'c') 
        AND REGEXP_LIKE(id, '[0-9]') 
        AND REGEXP_LIKE(id, '[^a-z0-9]', 'c')
    ),
    CONSTRAINT chk_admin_pw CHECK (
        CHAR_LENGTH(password) >= 8 
        AND NOT REGEXP_LIKE(password, '[A-Z]', 'c') 
        AND NOT REGEXP_LIKE(password, '[_./, ]') 
        AND REGEXP_LIKE(password, '[a-z]', 'c') 
        AND REGEXP_LIKE(password, '[0-9]') 
        AND REGEXP_LIKE(password, '[^a-z0-9]', 'c')
    )
);
CREATE TABLE AD_CONSENT (
    consent_id BIGINT NOT NULL AUTO_INCREMENT,
    company_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(16) NOT NULL,
    consent_status TINYINT(1) NOT NULL DEFAULT 1,
    status_date DATETIME NOT NULL,
    PRIMARY KEY (consent_id),
    CONSTRAINT fk_consent_company FOREIGN KEY (company_name) 
        REFERENCES COMPANY (company_name) ON DELETE CASCADE ON 
UPDATE CASCADE,
    CONSTRAINT chk_consent_phone CHECK (phone_number REGEXP '^[0-9]+$')
);
CREATE TABLE CONSENT_HISTORY (
    consent_id BIGINT NOT NULL,
    past_consent_date DATETIME NOT NULL,
    PRIMARY KEY (consent_id),
    CONSTRAINT fk_history_consent FOREIGN KEY (consent_id) 
        REFERENCES AD_CONSENT (consent_id) ON DELETE CASCADE ON UPDATE 
CASCADE
);
