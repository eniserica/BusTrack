//TODOLIST 
/**
 * Post motorista - ok
 * Post onibus - ok 
 * Get motorista - ok
 * Get onibus - ok
 * GET /onibus/motorista - 
 *  PUT /motoristas/onibus -
 *  DELETE /onibus/motorista/:id - 
 */

import express, { response } from "express";
import cors from "cors";
import fs from "node:fs";

const motoristas_1 = []
const PORT = 3333;
const url_databasemotoristas = "./database/motoristas.json";
const url_databaseonibus = "./database/onibus.json";
const url_databaseonibusmotoristas = "./database/onibus&motoristas.json";
const app = express();


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

//Cadastro Motorista
app.post("/motoristas", (request, response) => {

  //cria as variaveis que precisa para o cadastro 
  const { nome, data_nascimento, carteira_habilitacao } = request.body;

  //validacao dos campos obrigatorios
  if (!nome || typeof nome !== "string" || nome.trim() === "") {
    response
      .status(400)
      .json({ menssage: "O campo 'nome' é obrigatório e deve ser um texto" });
    return;
  }

  if (
    !carteira_habilitacao ||
    typeof carteira_habilitacao !== "string" ||
    carteira_habilitacao.trim() === ""
  ) {
    response
      .status(400)
      .json({
        menssage:
          "O campo 'carteira_habilitacao' é obrigatório e deve ser um texto",
      });
    return;
  }

  if (
    !data_nascimento ||
    typeof data_nascimento !== "string" ||
    data_nascimento.trim() === ""
  ) {
    response
      .status(400)
      .json({
        menssage: "O campo 'data_nascimento' é obrigatório e deve ser um texto",
      });
    return;
  }

  //ler o arquivo motoristas.json e adicionar o novo motorista 
  fs.readFile(url_databasemotoristas, 'utf-8', (err, data) => {
    if (err) {
      response.status(500).json({ mensagem: "Erro ao ler arquivo" });
      return;
    }
     

    const motoristas = JSON.parse(data);

    const novoMotorista = {
      id: Date.now().toString(),
      nome,
      data_nascimento,
      carteira_habilitacao,
    };

    motoristas.push(novoMotorista);
    console.log(motoristas);
    fs.writeFile(url_databasemotoristas, JSON.stringify(motoristas, null, 2), (err) => {
      if (err) {
        response.status(500).json({ mensagem: "Erro ao cadastrar motorista" });
        return;
      }
      response
        .status(201)
        .json({ mensagem: "Motorista cadastrada", data: novoMotorista });
    });
  });
});

//Cadastro Onibus 
app.post("/onibus", (request, response)=>{
    const {placa, modelo, ano_fabricacao, capacidade, motorista_id} = request.body;

    if( !placa || typeof placa !== "string" || placa.trim() === ""){
        response
        .status(400)
        .json({menssage: "O campo 'placa' é obrigatório e deve ser um texto"});
        return;
    }

    if( !modelo || typeof modelo !== "string" || modelo.trim() === ""){
        response
        .status(400)
        .json({menssage: "O campo 'modelo' é obrigatório e deve ser um texto"});
        return;
    }

    if( !ano_fabricacao|| typeof ano_fabricacao !== "string" || ano_fabricacao.trim() === ""){
        response
        .status(400)
        .json({menssage: "O campo 'ano_fabricacao' é obrigatório e deve ser um texto"});
        return;
    }

    if( !capacidade || typeof capacidade !== "string" || capacidade.trim() === ""){
        response
        .status(400)
        .json({menssage: "O campo 'capacidade' é obrigatório e deve ser um texto"});
        return;
    }

    if( !motorista_id || typeof motorista_id !== "string" || motorista_id.trim() === ""){
      response
      .status(400)
      .json({menssage: "O campo 'motorista_id' é obrigatório e deve ser um texto"});
      return;
    }


    fs.readFile(url_databaseonibus, 'utf-8', (err, data)=>{
        if (err){
            response.status(500)
            .json({mensagem: "Erro ao ler arquivo"});
            return;
        }

        const onibus = JSON.parse(data);

        const novoOnibus = {
            id: Date.now().toString(),
            placa,
            modelo,
            ano_fabricacao,
            capacidade,
            motorista_id

        };

        onibus.push(novoOnibus);
        console.log(onibus);
        fs.writeFile(url_databaseonibus, JSON.stringify(onibus, null, 2), (err)=>{
            if(err){
                response.status(500)
                .json({mensagem: "Erro ao cadastrar onibus"});
                return;
            }
            response.status(201).json({mensagem: "Onibus cadastrado", data: novoOnibus});
        })
    })
 })

//Listar Motoristas 
app.get("/motoristas/:id", (request, response) => {
    const { id } = request.params;

    fs.readFile(url_databasemotoristas, 'utf-8', (err, data) => {
        if (err) {
            response.status(500).json({ mensagem: "Erro ao ler arquivo" });
            return;
        }

        const motoristas = JSON.parse(data);

        const encontrarMotorista = motoristas.find((obj) => obj.id === id);
        if (!encontrarMotorista) {
            response.status(404).json({ mensagem: "Motorista não encontrado" });
            return;
        }

        response.status(200).json({ mensagem: "Motorista encontrado", data: encontrarMotorista });
    });
});

//Listar Onibus 
app.get("/onibus/:id", (request, response) => {
        const { id } = request.params;
        fs.readFile(url_databaseonibus, 'utf-8', (err, data) => {
            if (err) {
                response.status(500).json({ mensagem: "Erro ao ler arquivo" });
                return;
            }
    
            const onibus = JSON.parse(data);
    
            const encontrarOnibus= onibus.find((obj) => obj.id === id);
            if (!encontrarOnibus) {
                response.status(404).json({ mensagem: "Onibus não encontrado" });
                return;
            }
    
            response.status(200).json({ mensagem: "Onibus encontrado", data: encontrarOnibus});
        });

});

//Listar motoristas e seu determinado onibus 

app.get("/onibus/motorista/:id", (request, response) => {
  const { id } = request.params;
  //Ler o arquivo de ônibus
  fs.readFile(url_databaseonibus, "utf-8", (errBus, dataBus) => {
      if (errBus) {
          response.status(500).json({ mensagem: "Erro ao ler arquivo de ônibus" });
          return;
      }

      const onibus = JSON.parse(dataBus);

      const encontrarOnibus = onibus.find((obj) => obj.id === id);
      if (!encontrarOnibus) {
          response.status(404).json({ mensagem: "Ônibus não encontrado" });
          return;
      }

      //Ler o arquivo de motoristas
      fs.readFile(url_databasemotoristas, "utf-8", (errMotor, dataMotor) => {
          if (errMotor) {
              response.status(500).json({ mensagem: "Erro ao ler arquivo de motoristas" });
              return;
          }

          const motoristas = JSON.parse(dataMotor);

          // Encontra o motorista correspondente pelo motorista_id
          //Cria uma variavel pra armazenar o motorista correspondente dai procura no array de motoristas, passa no parametro apenas um motorista que tenha o mesmo id do motorista_id do ônibus
          const motoristaCorrespondente = motoristas.find(
              (motorista) => motorista.id === encontrarOnibus.motorista_id
          );

          // Adicione o motorista ao objeto do ônibus

          //assign usa pra juntar um objeto com outro, o push adiciona um novo objeto no array, mas nesse caso não é um array e sim juntar um objeto dentro de outro. 
          const onibusComMotorista = Object.assign({}, encontrarOnibus, {
            motorista: motoristaCorrespondente || null, //null se não encontrar o motorista
        });
          // Retorne o ônibus com o motorista
          response.status(200).json({
              mensagem: "Ônibus encontrado com motorista",
              data: onibusComMotorista,
          });
      });
  });
});

// app.put("/motoristas/onibus/:id", (req, res)=>{
//   const {id} = req.params;
//   const {onibus_id} = req.body;

//   if(!onibus_id || typeof onibus_id !== "string" || onibus_id.trim() === ""){
//     res
//     .status(400)
//     .json({menssage: "O campo 'onibus_id' é obrigatório e deve ser um texto"});
//     return;
//   }
// // Ler o arquivo motoristas.json
//   fs.readFile(url_databasemotoristas, "utf-8", (errMotor, dataMotor) => {
//     if (errMotor) {
//       res.status(500).json({ mensagem: "Erro ao ler arquivo de motoristas" });
//       return;
//     }

//   const motoristas = JSON.parse(dataMotor);

//   fs.readFile(url_databaseonibus, "utf-8", (errBus, dataBus) => {
//     if (errBus) {
//       res.status(500).json({ mensagem: "Erro ao ler arquivo de onibus" });
//       return;
//     }
  
 
  
//   const onibus = JSON.parse(dataBus);
//   const encontrarOnibus = onibus.find((obj)=> obj.id === onibus_id);
//   if (!encontrarOnibus){
//     res.status(404).json({mensagem: "Onibus não encontrado"});
//     return;
//   }

//   const encontrarMotorista = motoristas.find((obj) => obj.id === id);
//   if (!encontrarMotorista){
//     res.status(404).json({mensagem: "Motorista não encontrado"});
//     return;
//   }
  
// // Atualizar os dados do motorista
//   encontrarMotorista.onibus_id = onibus_id;

//   fs.writeFile(url_databasemotoristas, JSON.stringify(motoristas, null, 2), (err) => {
//     if (err) {
//         res.status(500).json({ mensagem: "Erro ao salvar alterações no arquivo" });
//         return;
//     }

//     res.status(200).json({ mensagem: "Motorista atualizado com sucesso", data: encontrarMotorista });
//   });
//   });
//   });


// // app.delete("/onibus/motoristas/:id", (req, res)=>{

// // })

app.listen(PORT, () => {
  console.log("Servidor iniciado em: http://localhost:3333");
});
