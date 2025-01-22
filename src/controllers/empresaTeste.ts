import { Request, Response } from "express";

export const empresaTeste = {
    get: (req: Request, res: Response) => {

        const { client } = req.params;
        
        res.json({
            cnpj: "123456789",
            nomeEmpresa: "Protmar Engenharia",
            email: "example@example.com",
            numeroCREA: "123456789",
            endereço: "Rua Exemplo, 123",
            telefone: "(44) 1234-5678",
        });
    },
};
