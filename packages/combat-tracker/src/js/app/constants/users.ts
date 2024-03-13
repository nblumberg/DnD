export const knownUsers = [
  "nathanielblumberg@gmail.com",
  "aryooki@gmail.com",
  "aweditandwrite@gmail.com",
  "april.maguire@gmail.com",
  "joaquinmercardo@gmail.com",
  "TMustacchio@gmail.com",
  "willhonley@gmail.com",
] as const;

export const userToCharacter: Record<(typeof knownUsers)[number], string[]> = {
  "nathanielblumberg@gmail.com": ["dm"],
  "aryooki@gmail.com": ["Harrow_Zinvaris"],
  "aweditandwrite@gmail.com": ["Harrow_Zinvaris"],
  "april.maguire@gmail.com": ["Rhiannon_Frey"],
  "joaquinmercardo@gmail.com": ["Throne"],
  "TMustacchio@gmail.com": ["Nacho_Chessier", "Eaton_Dorito"],
  "willhonley@gmail.com": ["John_Rambo_McClane"],
} as const;
