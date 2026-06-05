"use client";

import { useState } from "react";

const teamMembers = [
  {
    name: "Dana Brooks",
    email: "dana@eventx.com",
    role: "Coordinator",
  },
  {
    name: "Malik Nguyen",
    email: "malik@eventx.com",
    role: "Member",
  },
  {
    name: "Priya Shah",
    email: "priya@eventx.com",
    role: "Member",
  },
];

type TeamMember = (typeof teamMembers)[number];

const roleOptions = ["Member", "Coordinator"] as const;

export default function EventTeamAccessSection() {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [roleModalMember, setRoleModalMember] = useState<TeamMember | null>(null);
  const [pendingRole, setPendingRole] = useState<string>(roleOptions[0]);
  const [removeConfirmMember, setRemoveConfirmMember] = useState<TeamMember | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<string>(roleOptions[0]);

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
            onClick={() => {
              setNewMemberEmail("");
              setNewMemberRole(roleOptions[0]);
              setAddMemberOpen(true);
            }}
          >
            Add member
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.email}
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
                  ...
                </button>
                {menuOpenFor === member.email ? (
                  <div className="absolute right-0 top-11 z-10 w-48 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-black/5"
                      onClick={() => {
                        setMenuOpenFor(null);
                        setRoleModalMember(member);
                        setPendingRole(member.role === "Member" ? "Coordinator" : "Member");
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
          ))}
        </div>
      </section>

      {roleModalMember ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Update role
            </p>
            <h3 className="mt-2 text-xl font-semibold text-black">
              Change role for {roleModalMember.name}
            </h3>
            <p className="mt-2 text-sm text-black/60">
              Select the new role and confirm to update team access.
            </p>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-black">
              Role
              <select
                value={pendingRole}
                onChange={(event) => setPendingRole(event.target.value)}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                onClick={() => setRoleModalMember(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
                onClick={() => setRoleModalMember(null)}
              >
                Update role
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addMemberOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Add member
            </p>
            <h3 className="mt-2 text-xl font-semibold text-black">
              Invite a team member
            </h3>
            <p className="mt-2 text-sm text-black/60">
              Enter an email and assign a role for event access.
            </p>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-black">
              Email address
              <input
                type="email"
                name="memberEmail"
                autoComplete="email"
                placeholder="person@eventx.com"
                value={newMemberEmail}
                onChange={(event) => setNewMemberEmail(event.target.value)}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
            </label>

            <label className="mt-4 grid gap-2 text-sm font-semibold text-black">
              Role
              <select
                value={newMemberRole}
                onChange={(event) => setNewMemberRole(event.target.value)}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                onClick={() => setAddMemberOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
                onClick={() => setAddMemberOpen(false)}
              >
                Send invite
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {removeConfirmMember ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Remove member
            </p>
            <h3 className="mt-2 text-xl font-semibold text-black">
              Remove {removeConfirmMember.name}?
            </h3>
            <p className="mt-2 text-sm text-black/60">
              This member will lose access to event operations immediately.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                onClick={() => setRemoveConfirmMember(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 px-4 text-xs font-semibold uppercase tracking-widest text-rose-700 transition hover:border-rose-300"
                onClick={() => setRemoveConfirmMember(null)}
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
