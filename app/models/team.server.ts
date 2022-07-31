import type { User, Team } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Team } from "@prisma/client";

export function getTeam({
  id,
}: Pick<Team, "id"> & {
  userId: User["id"];
}) {
  return prisma.team.findFirst({
    select: { id: true, name: true, description: true },
    where: { id },
  });
}

export function getTeams({ userId }: { userId: User["id"] }) {
  return prisma.team.findMany({
    where: { users: { some: { id: userId } } },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

// export function createNote({
//   body,
//   title,
//   userId,
// }: Pick<Note, "body" | "title"> & {
//   userId: User["id"];
// }) {
//   return prisma.note.create({
//     data: {
//       title,
//       body,
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });
// }

// export function deleteNote({ id }: Pick<Team, "id">) {
//   return prisma.note.delete({
//     where: { id },
//   });
// }
