# Utilizar os exemplos


## 1)Instalar o node local do Hardhat

```
mkdir hardhat
cd hardhat
npm install --save-dev hardhat
npx hardhat init
npx hardhat node
```

### 1.1)Inicializar o node
```
npx hardhat init
```

### 1.2)Executar o node local do Hardhat

```
npx hardhat node
```

## 2)Instalar o deamon do Remix

No diretório de exemplo na pasta contrato

```
npm install -g @remix-project/remixd
```

### 2.1)Executar o deamon do Remix
```
remixd
```

## 3)Compilar o contrato no remix 
Abrir a IDE do Remix na URL https://remix.ethereum.org/

### 3.1)Ajustar no Workspace a opção remixd
Setar opção "localhost"


### 3.2)Realizar o Deploy
Setar a opção "Dev Hardhat Provider" 


## 4)Executar o serviço REST
No diretórios "exemplo"


### 4.1)Instalar pacotes
```
npm install
```

### 4.2)Configurar o serviço
criar arquivo .env com o seguinte conteúdo : 

```
ETHEREUM_NETWORK = "hardhat"
REST_HOST = "localhost"
REST_HOST_DB = "http://127.0.0.1:3002"
REST_PORT = 3002
SIGNER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ADDRESS_BC = "http://127.0.0.1:8545"
```

### 4.3)Executar serviço

## 5) Teste
No diretório backend/insomnia deixei uma exportação para uso no Insomnia para testar as APIs

```
npm start
```
