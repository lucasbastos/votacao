export interface EpisodeVote {
  voterId: string;
  escolha: string; // ID do episódio escolhido
  dataVoto: Date;
}

export interface EpisodeVoteRequest {
  voterId: string;
  escolha: string; // ID do episódio escolhido
}
