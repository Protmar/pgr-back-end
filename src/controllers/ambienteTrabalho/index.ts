// import { Request, Response } from "express";
// import { AuthenticatedUserRequest } from "../../middleware";
// import { gesPostService } from "../../services/ges";
// import { GesAttributes } from "../../models/Ges";
// import { AmbienteTrabalhoAttributes } from "../../models/AmbienteTrabalho";
// import { ATPostService } from "../../services/ambientesTrabalho";

// export const ATController = {
//     postAT: async (req: AuthenticatedUserRequest, res: Response) => {
//         try {
//             const { empresaId } = req.user!;
//             const {
//                 area,
//                 pedireito,
//                 qntjanelas,
//                 qntequipamentos,
//                 infoadicionais,
//                 listequipamentos,
//                 listmobiliarios,
//                 listveiculos,
//                 tipoEdificacaoId, 
//                 tetoId,
//                 paredeId,
//                 ventilacaoId,
//                 iluminacaoId,
//                 pisoId
//             } = req.body;

//             // const data = await ATPostService(empresaId, listequipamentos, listmobiliarios, listveiculos,{
//             //     area,
//             //     pe_direito: pedireito,
//             //     qnt_janelas: qntjanelas,
//             //     qnt_equipamentos: qntequipamentos,
//             //     informacoes_adicionais: infoadicionais,
//             //     tipo_edificacao_id: tipoEdificacaoId,
//             //     teto_id: tetoId,
//             //     parede_id: paredeId,
//             //     ventilacao_id: ventilacaoId,
//             //     iluminacao_id: iluminacaoId,
//             //     piso_id: pisoId
//             // } as AmbienteTrabalhoAttributes);

//             return res.status(201).json(data);
//         } catch (error) {
//             console.error("Erro no postges:", error);
//             return res.status(500).json({ error: "Erro interno do servidor" });
//         }
//     }
// };
