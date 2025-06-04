# 💰 To-do API

API RESTful para gerenciamento de tarefas pessoais, construída com foco em escalabilidade, segurança e manutenibilidade.

---

## 🧠 Descrição

Esta API foi desenvolvida com **TypeScript**, **NestJS** e **Node.js**, seguindo os princípios da **Clean Architecture**, **SOLID** e **Domain-Driven Design (DDD)**.  
Conta com:

- Autenticação segura via **JWT**
- Banco de dados gerenciado com **Prisma ORM**

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT](https://jwt.io/)
- Clean Architecture + SOLID + DDD

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/ayranoliveira1/teste-tecnico-backend.git
cd nome-do-repo

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais (banco de dados, JWT, Stripe, OpenAI)

#Iniciar Docker
docker compose up -d

# Execute as migrations do Prisma
pnpm prisma migrate dev

# Inicie o servidor
pnpm start:dev
```

---

## 📫 Endpoints

A documentação completa está disponível via Swagger em:

```
http://localhost:3001/api
```

---

## 🧪 Testes

```bash
# Execute os testes unitários
pnpm test

# Execute os testes End-to-end
pnpm test:e2e
```

---

## 🧱 Justificativa Arquitetural

O projeto segue a **Clean Architecture**, que separa claramente a lógica de negócio das camadas técnicas. Com isso:

- O **domínio** é completamente independente de frameworks e bibliotecas externas.
- A lógica de negócio é representada por **casos de uso** e **entidades ricas**, modeladas com base no **DDD**.
- A camada de **infraestrutura** lida com detalhes como persistência de dados (Prisma), autenticação e entrega via HTTP (controllers, mappers e presenters).
- A separação em camadas permite **testes unitários precisos**, **fácil manutenção**, **alta escalabilidade** e **substituição de tecnologias** com baixo acoplamento.

---

## 🗂️ Estrutura de Pastas

```plaintext
src/
├── core/ # Módulos genéricos e utilitários (erros, DTOs, interfaces)
├── domain/ # Camada de domínio (entidades, repositórios, casos de uso)
│ ├── entities/
│ ├── repositories/
│ └── use-cases/
├── infra/ # Implementações de infraestrutura (banco, auth, controllers, mappers)
│ ├── auth/
│ ├── database/
│ ├── env/
│ ├── http/
│ ├── controllers/
│ ├── mappers/
│ └── presenters/
├── main.ts # Ponto de entrada da aplicação

---
```
