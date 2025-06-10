export type User = {
  id: string;
  phone: string;
  isAdmin: boolean;
  name: string;
  address?: Address;
};

export type Address = {
  street: string;
  neighborhood: string;
  houseNumber: string;
  city: string;
  cep: string;
  complement?: string;
  ref?: string;
};
