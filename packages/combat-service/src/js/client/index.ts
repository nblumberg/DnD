import axios from "axios";
import { Auditioner, CastMember } from "creature";
export type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../sockets/socketTypes";

const baseUrl = "http://localhost:6677/v1/";

export async function listCastMembers(): Promise<CastMember[]> {
  const { data: castMembers }: { data: CastMember[] } = await axios.get(
    `${baseUrl}cast`
  );
  return castMembers;
}

export async function castActor(auditioner: Auditioner): Promise<CastMember> {
  const { data: castMember }: { data: CastMember } = await axios.post(
    `${baseUrl}cast`,
    auditioner
  );
  return castMember;
}

export async function getCastMember(id: string): Promise<CastMember> {
  const { data: castMember }: { data: CastMember } = await axios.get(
    `${baseUrl}cast/${id}`
  );
  return castMember;
}

export async function delayInitiative(id: string): Promise<CastMember> {
  const { data: castMember }: { data: CastMember } = await axios.patch(
    `${baseUrl}cast/${id}/delay`
  );
  return castMember;
}

export async function changeInitiativeOrder(
  id: string,
  initiativeOrder: number
): Promise<CastMember> {
  const { data: castMember }: { data: CastMember } = await axios.patch(
    `${baseUrl}cast/${id}/initiativeOrder`,
    initiativeOrder
  );
  return castMember;
}
