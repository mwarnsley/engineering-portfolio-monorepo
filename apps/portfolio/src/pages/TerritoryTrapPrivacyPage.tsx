import { TerritoryTrapPageLayout, TERRITORY_TRAP_EFFECTIVE_DATE, TERRITORY_TRAP_SUPPORT_EMAIL } from './TerritoryTrapPageLayout';

export const TerritoryTrapPrivacyPage = () => (
  <TerritoryTrapPageLayout
    title="Territory Trap Privacy Policy"
    subtitle="Privacy information for the Territory Trap mobile app"
  >
    <div className="space-y-8 text-sm leading-7 text-foreground/75">
      <section className="space-y-3">
        <p>
          This Privacy Policy applies to the Territory Trap mobile app. It explains, in simple
          terms, how the app currently handles player information during beta testing and general
          use.
        </p>
        <p>
          Territory Trap does not require account creation, and it does not currently use a backend
          account system for player sign-in, profiles, or cloud-synced progress.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Data Storage
        </h3>
        <p>
          Gameplay data, such as your high score and other local app state, is currently stored on
          your device. If you delete the app or clear app data, that information may be removed.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Personal Information
        </h3>
        <p>
          Based on the app&apos;s current implementation, Territory Trap does not intentionally collect
          personal information from players through an in-app account system or direct user profile
          collection flow.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Contact</h3>
        <p>
          If you have privacy questions about Territory Trap, please contact{' '}
          <a
            href={`mailto:${TERRITORY_TRAP_SUPPORT_EMAIL}`}
            className="text-accent underline underline-offset-4"
          >
            {TERRITORY_TRAP_SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>

      <p className="border-t border-border pt-6 font-mono text-xs uppercase tracking-[0.3em] text-foreground/45">
        Effective date: {TERRITORY_TRAP_EFFECTIVE_DATE}
      </p>
    </div>
  </TerritoryTrapPageLayout>
);
