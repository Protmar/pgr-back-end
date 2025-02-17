import { GesTrabalhador } from "../../../models/subdivisoesGes/GesTrabalhadores";

export const gesTrabalhadoresPost = async (empresa_id:number, id_ges: number, gesTrabalhadoresList: any[]) => {
    try {
        await Promise.all(
            gesTrabalhadoresList.map((curso) =>
                GesTrabalhador.create({
                    empresa_id,
                    id_ges,
                    id_trabalhador: curso.value
                })
            )
        );
    } catch (error) {
        console.error("Erro ao criar Ges Trabalhadores:", error);
    }
}