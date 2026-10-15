CREATE DATABASE customers;

CREATE TABLE customers.customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    nome_do_cartao VARCHAR(255),
    numero_cartao VARCHAR(50),
    ccv VARCHAR(10),
    data_expiracao VARCHAR(10),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO customers.customers (email, name, active, nome_do_cartao, numero_cartao, ccv, data_expiracao) VALUES
('ana.silva@example.com', 'Ana Silva', TRUE, 'ANA SILVA', '4111222233334444', '123', '12/28'),
('carlos.souza@example.com', 'Carlos Souza', TRUE, 'CARLOS SOUZA', '5555444433332222', '456', '09/27'),
('mariana.lima@example.com', 'Mariana Lima', FALSE, 'MARIANA LIMA', '378282246310005', '789', '05/29'),
('joao.pereira@example.com', 'João Pereira', TRUE, 'JOAO PEREIRA', '4000123456789010', '321', '11/26'),
('beatriz.costa@example.com', 'Beatriz Costa', TRUE, 'BEATRIZ COSTA', '5105105105105100', '654', '03/30'),
('lucas.alves@example.com', 'Lucas Alves', TRUE, 'LUCAS ALVES', '4222222222222222', '987', '08/28'),
('julia.martins@example.com', 'Júlia Martins', FALSE, 'JULIA MARTINS', '6011111111111117', '159', '12/26'),
('gabriel.rocha@example.com', 'Gabriel Rocha', TRUE, 'GABRIEL ROCHA', '352838000000000', '753', '06/29'),
('fernanda.ribeiro@example.com', 'Fernanda Ribeiro', TRUE, 'FERNANDA RIBEIRO', '4111111111111111', '852', '01/27'),
('rafael.barbosa@example.com', 'Rafael Barbosa', TRUE, 'RAFAEL BARBOSA', '5412750000000000', '951', '10/30');