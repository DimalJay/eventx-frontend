"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/service/teamService";
import { EllipsisVertical } from "lucide-react";
import RoleChangeDialog from "../dialogs/RoleChangeDialog";
import AddMemberDialog from "../dialogs/AddMemberDialog";
import RemoveMemberDialog from "../dialogs/RemoveMemberDialog";
import { TeamAccessLoadingSkeleton } from "@/components/skeleton/TeamAccessLoadingSkeleton";
import { decodeEventId } from "@/lib/utils";
import type { TeamMember } from "@/types/team";


export default function EventTeamAccessSection() {
  const { id } = useParams() as { id: string };
  const eventId = decodeEventId(id);

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["team-members", eventId],
    queryFn: async () => {
      const response = await getTeamMembers({ eventId });
      return response.data as TeamMember[];
    },
    enabled: !!eventId,
    retry: false,
  });

  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [roleModalMember, setRoleModalMember] = useState<TeamMember | null>(null);
  const [removeConfirmMember, setRemoveConfirmMember] = useState<TeamMember | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  return (
    <>
      <section className="rounded-2xl border border-zinc-200 bg-white p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Team access
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
              Manage event operators
            </h2>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setAddMemberOpen(true)}
          >
            Add member
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {isLoading ? (
            <TeamAccessLoadingSkeleton />
          ) : teamMembers.length === 0 ? (
            <p className="text-sm text-zinc-600">No team members found.</p>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className="grid gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 sm:grid-cols-[1.4fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-base font-semibold text-zinc-900">{member.name}</p>
                  <p className="text-sm text-zinc-600">{member.email}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {member.role}
                  </p>
                </div>
                <div className="relative flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={menuOpenFor === member.email}
                    onClick={() =>
                      setMenuOpenFor((current) =>
                        current === member.email ? null : member.email
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-lg font-semibold text-zinc-700 transition hover:border-zinc-400"
                  >
                    <EllipsisVertical/>
                  </button>
                  {menuOpenFor === member.email ? (
                    <div className="absolute right-0 top-11 z-10 w-48 max-w-[90vw] rounded-2xl border border-zinc-200 bg-white p-2 shadow-pop sm:right-0">
                      <button
                        type="button"
                        className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                        onClick={() => {
                          setMenuOpenFor(null);
                          setRoleModalMember(member);
                        }}
                      >
                        Promote / demote
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                        onClick={() => {
                          setMenuOpenFor(null);
                          setRemoveConfirmMember(member);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <RoleChangeDialog
        eventId={eventId}
        member={roleModalMember!}
        open={!!roleModalMember}
        onClose={() => setRoleModalMember(null)}
      />

      <AddMemberDialog
        eventId={eventId}
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />

      <RemoveMemberDialog
        eventId={eventId}
        member={removeConfirmMember!}
        open={!!removeConfirmMember}
        onClose={() => setRemoveConfirmMember(null)}
      />
    </>
  );
}
