"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/service/teamService";
import { EllipsisVertical } from "lucide-react";
import RoleChangeDialog from "../dialog/RoleChangeDialog";
import AddMemberDialog from "../dialog/AddMemberDialog";
import RemoveMemberDialog from "../dialog/RemoveMemberDialog";

type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: string;
};


export default function EventTeamAccessSection() {
  const { id: eventId } = useParams() as { id: string };

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
      <section className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Team Access
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">
              Manage event operators
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            onClick={() => setAddMemberOpen(true)}
          >
            Add member
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {isLoading ? (
            <p className="text-sm text-black/60">Loading team members...</p>
          ) : teamMembers.length === 0 ? (
            <p className="text-sm text-black/60">No team members found.</p>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.4fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-base font-semibold text-black">{member.name}</p>
                  <p className="text-sm text-black/60">{member.email}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-lg font-semibold text-black transition hover:border-black/40"
                  >
                    <EllipsisVertical/>
                  </button>
                  {menuOpenFor === member.email ? (
                    <div className="absolute right-0 top-11 z-10 w-48 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)]">
                      <button
                        type="button"
                        className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-black/5"
                        onClick={() => {
                          setMenuOpenFor(null);
                          setRoleModalMember(member);
                        }}
                      >
                        Promote / Demote
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest text-rose-700 transition hover:bg-rose-50"
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
