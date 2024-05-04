export type HkLink = {
  text?: string;
  url: string;
  external?: '_blank' | '_self';
};

export type StyckDetaljTitle =
  | 'HOGREV'
  | 'ENTRECOTE'
  | 'RYGGBIFF'
  | 'OXFILE'
  | 'ROSTBIFF'
  | 'LAR'
  | 'SVANS'
  | 'RULLE'
  | 'PICANHA'
  | 'FRANSYSKA'
  | 'CUVETTE'
  | 'FLANK'
  | 'BRISKET'
  | 'BOG'
  | 'BOGRULLE';

export type StyckDetaljer = {
  title: StyckDetaljTitle;
  number: number;
  buttons?: HkLink[];
};
