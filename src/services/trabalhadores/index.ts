import { getCache } from "../../controllers/cliente/cliente";
import { Ges, User } from "../../models";
import { CadastroCargo } from "../../models/Cargos";
import { Cliente } from "../../models/Cliente";
import { CadastroFuncao } from "../../models/Funcoes";
import { CadastroGerencia } from "../../models/Gerencias";
import Servicos from "../../models/Servicos";
import { CadastroSetor } from "../../models/Setores";
import { GesTrabalhador } from "../../models/subdivisoesGes/GesTrabalhadores";
import Trabalhadores, {
  TrabalhadorCreationAttributes,
} from "../../models/Trabalhadores";
import { ATPostService } from "../ambientesTrabalho";

export const postDadosTrabalhadorService = async (
  params: TrabalhadorCreationAttributes
) => {
  try {
    console.log("Params recebidos para create:", params); // log de params
    const data = await Trabalhadores.create(params, { logging: console.log }); // log do SQL
    console.log("Trabalhador criado:", data.toJSON());
    return data;
  } catch (err) {
    console.error("Erro ao criar trabalhador:", err);
    throw err; // repassa o erro para o controller
  }
};



export const postDadosTrabalhadorExcelService = async (
  params: any[] | object,
  empresaId: string
) => {
  if (!Array.isArray(params) && typeof params === 'object') {
    params = [params];
  }

  if (!Array.isArray(params)) {
    return Promise.reject(new Error('Os parâmetros enviados não são um array válido.'));
  }

  for (let index = 0; index < params.length; index++) {
    const item = params[index];
    try {
      const camposObrigatorios = ["codigo", "nome"];
      const camposFaltando = camposObrigatorios.filter(campo => !item[campo]);
      if (camposFaltando.length > 0) {
        throw new Error(`Campos obrigatórios ausentes no item ${index + 1}: ${camposFaltando.join(', ')}`);
      }

      // if (!empresaId || isNaN(Number(empresaId))) {
      //   throw new Error('O parâmetro empresaId não é válido.');
      // }

      // if (!item.cpf || item.cpf.length < 11) {
      //   throw new Error(`CPF inválido no item ${index + 1}: ${item.cpf}`);
      // }

      // if (!item.rg || item.rg.length < 9) {
      //   throw new Error(`RG inválido no item ${index + 1}: ${item.rg}`);
      // }

      // if (!item.pis) {
      //   throw new Error(`PIS inválido no item ${index + 1}: ${item.pis}`);
      // }

      // if (!item.jornada || isNaN(item.jornada) || item.jornada <= 0) {
      //   throw new Error(`Jornada inválida no item ${index + 1}: ${item.jornada}`);
      // }

      let cliente = await Cliente.findOne({ where: { nome_fantasia: item.cliente, empresa_id: empresaId } });
      let clienteId = cliente ? cliente.dataValues.id : null;
      if (!clienteId) {
        const novoCliente = await Cliente.create({
          nome_fantasia: item.cliente,
          empresa_id: Number(empresaId),
        });
        clienteId = novoCliente.dataValues.id;
      }

      // if (!clienteId) {
      //   throw new Error(`Cliente não encontrado ou criado para o item ${index + 1}`);
      // }

      let servico = await Servicos.findOne({ where: { descricao: item.servico, empresa_id: empresaId } });
      let servicoId = servico ? servico.dataValues.id : null;
      if (!servicoId) {
        const novoServico = await Servicos.create({
          descricao: item.servico,
          empresa_id: Number(empresaId),
        });
        servicoId = novoServico.dataValues.id;
      }

      let trabalhador = await Trabalhadores.findOne({ where: { codigo: item.codigo, servico_id: servicoId, empresa_id: empresaId } });
      let trabalhadorId = trabalhador ? trabalhador.dataValues.id : null;

      let gerencia = await CadastroGerencia.findOne({ where: { descricao: item.gerencia, empresa_id: empresaId } });
      let gerenciaId = gerencia ? gerencia.dataValues.id : null;
      if (!gerenciaId) {
        const novaGerencia = await CadastroGerencia.create({
          descricao: item.gerencia,
          empresa_id: Number(empresaId),
        });
        gerenciaId = novaGerencia.dataValues.id;
      }

      let setor = await CadastroSetor.findOne({ where: { descricao: item.setor, empresa_id: empresaId } });
      let setorId = setor ? setor.dataValues.id : null;
      if (!setorId) {
        const novoSetor = await CadastroSetor.create({
          descricao: item.setor,
          empresa_id: Number(empresaId),
        });
        setorId = novoSetor.dataValues.id;
      }

      let cargo = await CadastroCargo.findOne({ where: { descricao: item.cargo, empresa_id: empresaId } });
      let cargoId: number;
      let cargoDescricao: string;

      if (cargo) {
        cargoId = cargo.dataValues.id;
        cargoDescricao = cargo.dataValues.descricao;
      } else {
        const novoCargo = await CadastroCargo.create({
          descricao: item.cargo,
          empresa_id: Number(empresaId),
        });
        cargoId = novoCargo.dataValues.id;
        cargoDescricao = novoCargo.dataValues.descricao;
      }

      let funcao = await CadastroFuncao.findOne({ where: { funcao: item.funcao, empresa_id: empresaId } });
      let funcaoId = funcao ? funcao.dataValues.id : null;
      if (!funcaoId) {
        const novaFuncao = await CadastroFuncao.create({
          funcao: item.funcao,
          descricao: "",
          cbo: "",
          empresa_id: Number(empresaId),
        });
        funcaoId = novaFuncao.dataValues.id;
      }

      const codigoGesSanitizado = (item.codigoGes || "");
      // if (!codigoGesSanitizado) {
      //   throw new Error(`Código GES ausente ou inválido no item ${index + 1}`);
      // }

      let ges = await Ges.findOne({
        where: {
          codigo: codigoGesSanitizado,
          empresa_id: empresaId,
          servico_id: servicoId,
        },
      });

      let gesId = ges ? ges.dataValues.id : null;
      if (!ges) {
        const novoGes = await Ges.create({
          codigo: codigoGesSanitizado,
          cliente_id: clienteId,
          servico_id: servicoId,
          descricao_ges: item.descricaoGes,
          observacao: "",
          responsavel: "",
          cargo: "",
          nome_fluxograma: "",
          empresa_id: Number(empresaId),
        });
        
        
        gesId = novoGes.dataValues.id;
        await ATPostService(Number(novoGes.dataValues.empresa_id), [], [], [], [], gesId, "", "", "");
      }

      const novoTrabalhador = {
        empresa_id: Number(empresaId),
        cliente_id: clienteId,
        servico_id: servicoId,
        gerencia_id: gerenciaId,
        setor_id: setorId,
        cargo_id: cargoId,
        cargo: cargoDescricao,
        funcao_id: funcaoId,
        codigo: item.codigo || "",
        nome: item.nome || "",
        cpf: item.cpf || "",
        rg: item.rg || "",
        nis_pis: item.pis || "",
        jornada_trabalho: item.jornada || "",
        codigoGes: item.codigoGes || "",
        empresaId,
        genero: item.genero || "",
        data_nascimento: item.dataNascimento || "",
        orgao_expeditor: item.orgaoExpeditor || "",
        ctps: item.ctps || "",
        serie: item.serie || "",
        uf: item.uf || "",
      };

      if (!trabalhadorId) {
        const newWorker = await Trabalhadores.create(novoTrabalhador);

        await GesTrabalhador.create({
          id_ges: gesId || 0,
          id_trabalhador: Number(newWorker.dataValues.id),
          id_funcao: funcaoId,
        });
      }

    } catch (error) {
      console.error(`Erro no processamento do item ${index + 1}:`, (error as Error).message);
      throw new Error(`Falha ao processar item ${index + 1}: ${(error as Error).message}`);
    }
  }
};







export const getDadosAllTrabalhadoresService = async (empresaId: string, userId: number) => {
  const cliente_id = await User.findOne({
        where: { id: userId },
        attributes: ["clienteselecionado"],
      });
  const servicoObj = await User.findOne({
          where: { id: userId },
          attributes: ["servicoselecionado"],
        });
  const servico_id = servicoObj;

  if (cliente_id ) {
    const servicoSelecionado = servicoObj?.dataValues?.servicoselecionado;
    const whereClause: any = {
      empresa_id: Number(empresaId),
      cliente_id: Number(cliente_id?.dataValues.clienteselecionado),
    };
    if (typeof servicoSelecionado === "number") {
      whereClause.servico_id = servicoSelecionado;
    }
    const data = Trabalhadores.findAll({
      where: whereClause,
    });
    return data;
  }
};

export const getDadosTrabalhadorService = (
  empresaId: string,
  trabalhadorId: string
) => {
  const data = Trabalhadores.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: Number(trabalhadorId),
    },
    include: [
      {
        model: CadastroFuncao,
        as: "funcao",
      },
    ],
  });

  return data;
};

export const getDadosComumService = (cargo: number, setor: number, gerencia: number) => {
  const data = Trabalhadores.findAll({
    where: {
      cargo_id: cargo,
      setor_id: setor,
      gerencia_id: gerencia
    }
  });
  return data;
}

export const getDadosTrabalhadoByIdService = (
  empresaId: string,
  trabalhadorId: string
) => {
  const data = Trabalhadores.findOne({
    where: { empresa_id: Number(empresaId), id: Number(trabalhadorId) },
  });
  return data;
};

export const putDadosTrabalhadorService = (
  funcao_id: number,
  empresaId: string,
  trabalhadorId: string,
  gerencia_id: string,
  cargo_id: string,
  setor_id: string,
  codigo: string,
  nome: string | null,
  genero: string,
  data_nascimento: string,
  cpf: string,
  rg: string,
  orgao_expeditor: string,
  nis_pis: string,
  ctps: string,
  serie: string,
  uf: string,
  jornada_trabalho: string,
  cargo: string,
  qnt_trabalhadores?: number
) => {
  const data = Trabalhadores.update(
    {
      funcao_id,
      gerencia_id: Number(gerencia_id),
      cargo_id: Number(cargo_id),
      setor_id: Number(setor_id),
      codigo,
      nome : nome !== null ? nome : undefined,
      genero,
      data_nascimento,
      cpf,
      rg,
      orgao_expeditor,
      nis_pis,
      ctps,
      serie,
      uf,
      jornada_trabalho,
      cargo,
      qnt_trabalhadores: qnt_trabalhadores !== undefined ? qnt_trabalhadores : undefined
    },
    { where: { empresa_id: Number(empresaId), id: trabalhadorId } }
  );
  return data;
};

export const deleteDadosTrabalhadorService = (
  empresaId: string,
  trabaladorId: string
) => {
  const data = Trabalhadores.destroy({
    where: { empresa_id: Number(empresaId), id: trabaladorId },
  });
  return data;
};

export const getNomeCargoService = (empresaId: string, cargoId: number) => {
  const data = CadastroCargo.findOne({
    where: {
      empresa_id: empresaId,
      id: cargoId
    }
  })
  return data;
}

export const getNomeSetorService = (empresaId: string, setorId: number) => {
  const data = CadastroSetor.findOne({
    where: {
      empresa_id: empresaId,
      id: setorId
    }
  })
  return data;
}

export const getNomeGerenciaService = (empresaId: string, gerenciaId: number) => {
  const data = CadastroGerencia.findOne({
    where: {
      empresa_id: empresaId,
      id: gerenciaId
    }
  })
  return data;
}