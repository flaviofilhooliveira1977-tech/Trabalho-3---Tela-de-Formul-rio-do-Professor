# Proffy Web 2026 — Fluxo de Cadastro e Perfil do Professor

Aplicação web desenvolvida para conectar estudantes e professores na plataforma **Proffy**. Este repositório contempla a implementação do **Trabalho 3 — Tela de Formulário do Professor**, abrangendo o fluxo completo de inscrição de aulas, confirmação de cadastro e gerenciamento do perfil do professor.

---

## Como rodar o projeto localmente

### Pré-requisitos
- **Node.js** (versão 20+ recomendada)
- **npm** (ou gerenciador de pacotes compatível)

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd proffy-web-2026
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador o endereço exibido no terminal (por padrão `http://localhost:5173`).

---

## Rotas e Telas Implementadas

| Rota | Componente | Descrição |
| :--- | :--- | :--- |
| `/` | `Home` | Tela inicial com atalhos para **Estudar**, **Dar aulas** e acesso ao **Meu perfil**. |
| `/give-classes` | `TeacherForms` | **1. Formulário — "Dar aulas"**: cadastro de WhatsApp (com máscara), biografia (máx. 300 caracteres), matéria, custo da hora/aula com prefixo `R$` e lista dinâmica de horários disponíveis. |
| `/give-classes/register-completed` | `TeacherFormsCompleted` | **2. Confirmação — "Cadastro salvo!"**: tela de feedback visual utilizando o componente `Finally` com redirecionamento para o perfil do professor através do botão `"Acessar lista"`. |
| `/profile` | `TeacherProfile` | **3. Perfil do professor — "Meu perfil"**: visualização e edição completa dos dados cadastrados (nome, sobrenome, foto de perfil, e-mail, WhatsApp, biografia, matéria, valor da hora/aula e adição/exclusão de horários disponíveis). |
| `/study` | `TeacherList` | Listagem e busca de professores disponíveis para estudo. |
| `/sign-in` | `SignIn` | Tela de autenticação do usuário. |
| `/sign-up` | `SignUp` | Tela de criação de conta. |
| `/sign-up/finally-register` | `FinallyRegister` | Confirmação de criação de conta de usuário. |

---

## Decisões Técnicas Relevantes

1. **Gerenciamento de Formulários e Horários Dinâmicos (`react-hook-form` + `useFieldArray`)**:
   - Utilizamos `useForm` com `mode: "onChange"` para validação reativa em tempo real sem re-renderizações desnecessárias, habilitando o botão `"Salvar cadastro"` apenas quando todos os campos obrigatórios estão válidos (`isValid`).
   - O gerenciamento dinâmico da lista de horários (`schedule`) foi estruturado com `useFieldArray`, permitindo adicionar quantos horários forem necessários (`append`) e removê-los (`remove`) preservando os índices e o estado de cada linha.

2. **Validação Declarativa e Tipagem Estrita (`Zod` + `@hookform/resolvers`)**:
   - Os schemas `scheduleItemSchema` e `teacherFormSchema` centralizam todas as regras de negócio:
     - Transformação `.trim()` em campos de texto para impedir envio de espaços em branco.
     - Validação de telefone via expressão regular compatível com a máscara `(DD) 9XXXX-XXXX`.
     - Limite estrito de 300 caracteres na biografia (`.max(300)`).
     - Conversão automática do custo da hora-aula com `z.coerce.number().positive()`, separando os tipos de entrada (`z.input`) e saída (`z.infer`) no `useForm`.
     - Validação cruzada (`.refine`) nos horários para garantir que o horário final (`to`) seja sempre posterior ao horário inicial (`from`), apontando o erro diretamente para o campo `to` (`path: ["to"]`).

3. **Máscara de Telefone e Persistência entre Telas**:
   - Criamos o utilitário `formatWhatsApp` (`src/utils/masks.ts`) integrado ao evento `onChange` do `InputCustom`, aplicando a máscara `(00) 00000-0000` em tempo real enquanto o usuário digita.
   - Os dados preenchidos no formulário **"Dar aulas"** são persistidos em `localStorage` através do módulo `src/utils/teacher-storage.ts`, garantindo que sejam refletidos fielmente na tela **"Meu perfil"** (`/profile`) após passar pela tela de confirmação.

4. **Componentização e Reaproveitamento**:
   - Criamos o componente `PageHeader` (`src/components/page-header.tsx`) para padronizar o cabeçalho das páginas internas.
   - Evoluímos os componentes `InputCustom` (suporte a `prefix="R$"` e composição de `onChange`), `Select` (uso de `defaultValue=""` para placeholders reais) e `Finally` (suporte a `ReactNode` no subtítulo para quebras de linha semânticas).

5. **Organização de schemas e constantes**:
   - Os schemas Zod (formulário e perfil) ficam em `src/schemas/teacher-schemas.ts` e as opções de matéria/dia da semana em `src/constants/teacher-options.ts`, evitando duplicação entre as telas.
   - O botão "Salvar cadastro" fica sempre habilitado: ao clicar com campos inválidos, todas as mensagens de erro são exibidas.
