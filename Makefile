initialize:
	npm init -y
	npm install discord.js
	npm install dotenv
	npm install -D typescript ts-node @types/node
	npx tsc --init
	npm install @google/genai
	npm install dotenv
run:
	npx ts-node src/index.ts

build:
	npm run build

database:
	npm install mongoose
	npm install -D @types/mongoose

schemas:
	npm install zod

google:
	npm install @google/genai