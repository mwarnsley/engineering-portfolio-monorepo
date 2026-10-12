import { TERRITORY_TRAP_SUPPORT_EMAIL, TerritoryTrapPageLayout } from './TerritoryTrapPageLayout';

export const TerritoryTrapSupportPage = () => (
  <TerritoryTrapPageLayout
    title="Territory Trap Support"
    subtitle="Support and beta feedback for Territory Trap"
  >
    <div className="space-y-8 text-sm leading-7 text-muted-foreground">
      <section className="space-y-3">
        <p>
          This page is the public support contact for Territory Trap. If you are testing the app,
          you can use it to report bugs, ask questions, or send general gameplay feedback.
        </p>
        <p>
          Territory Trap is currently in beta/testing, so small issues, balance changes, and
          quality-of-life updates may still be in progress as the app improves.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">How To Report An Issue</h2>
        <p>
          When possible, include the device model, iOS version, a short description of what you were
          doing, what happened, and any screenshots that help explain the problem.
        </p>
        <p>
          Send support requests or feedback to{' '}
          <a
            href={`mailto:${TERRITORY_TRAP_SUPPORT_EMAIL}`}
            className="rounded-sm text-brand underline underline-offset-4"
          >
            {TERRITORY_TRAP_SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">TestFlight Feedback</h2>
        <p>
          If you are using a TestFlight build, you can also send feedback through Apple&apos;s
          TestFlight feedback flow to include screenshots and build details directly with your
          report.
        </p>
      </section>
    </div>
  </TerritoryTrapPageLayout>
);
