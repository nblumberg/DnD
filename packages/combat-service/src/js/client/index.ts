import axios from "axios";
import { Auditioner, CastMember, CastMemberRaw } from "creature";
export type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../sockets/socketTypes";

const baseUrl = "http://localhost:6677/v1/";

export async function listCastMembers(): Promise<CastMember[]> {
  const { data: castMembersRaw }: { data: CastMemberRaw[] } = await axios.get(
    `${baseUrl}cast`
  );
  return castMembersRaw.map((castMemberRaw) => new CastMember(castMemberRaw));
}

export async function castActor(auditioner: Auditioner): Promise<CastMember> {
  const { data: castMemberRaw }: { data: CastMemberRaw } = await axios.post(
    `${baseUrl}cast`,
    auditioner
  );
  return new CastMember(castMemberRaw);
}

export async function getCastMember(id: string): Promise<CastMember> {
  const { data: castMemberRaw }: { data: CastMemberRaw } = await axios.get(
    `${baseUrl}cast/${id}`
  );
  return new CastMember(castMemberRaw);
}

export async function delayInitiative(id: string): Promise<CastMember> {
  const { data: castMemberRaw }: { data: CastMemberRaw } = await axios.patch(
    `${baseUrl}cast/${id}/delay`
  );
  return new CastMember(castMemberRaw);
}

export async function changeInitiativeOrder(
  id: string,
  initiativeOrder: number
): Promise<CastMember> {
  const { data: castMemberRaw }: { data: CastMemberRaw } = await axios.patch(
    `${baseUrl}cast/${id}/initiativeOrder`,
    initiativeOrder
  );
  return new CastMember(castMemberRaw);
}
