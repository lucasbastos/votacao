export interface Vote {
  voterId: string;
  escolhas: string[]; // Array com 3 IDs dos jogos escolhidos, ordenados por preferência
  dataVoto: Date;
}

export interface VoteRequest {
  voterId: string;
  escolhas: string[]; // Array com 3 IDs dos jogos escolhidos
}
