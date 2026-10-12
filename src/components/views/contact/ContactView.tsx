import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ComponentType } from "react";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Artboard } from "@/components/ui/Artboard";
import { channels, contactBoards, engagement, socials, type ChannelIcon, type SocialIcon } from "@/content/contact";
import { profile } from "@/content/profile";
import { ContactForm } from "./ContactForm";
import s from "./contact.module.css";

type Icon = ComponentType<{ size?: number; strokeWidth?: number }>;
const channelIcons: Record<ChannelIcon, Icon> = { mail: Mail, phone: Phone, pin: MapPin };
const socialIcons: Record<SocialIcon, Icon> = { globe: Globe, linkedin: LinkedinIcon, instagram: InstagramIcon };

/** Contact view: invitation, direct channels, social profiles and the message form. */
export function ContactView() {
  return (
    <>
      <Artboard board={contactBoards.hello} tone="plum" pad={56}>
        <div className={s.helloArrow} aria-hidden>
          <span>→</span>
        </div>
        <h2 className={s.hello}>
          LET&apos;S
          <br />
          WORK
          <br />
          <span className={s.helloSoft}>TOGETHER</span>
        </h2>
      </Artboard>

      <Artboard board={contactBoards.direct} pad={40}>
        <Artboard.Header pill="Reach me" aside="Email · Phone · Location" />
        <Artboard.Title>Direct</Artboard.Title>
        <Artboard.Rule />
        <Artboard.Body className={s.channels}>
          {channels.map((c) => {
            const Icon = channelIcons[c.icon];
            const inner = (
              <>
                <span className={`${s.channelIcon} ${s[`tone${c.tone}`]}`}>
                  <Icon size={30} />
                </span>
                <span className={s.channelText}>
                  <span className={s.channelLabel}>{c.label}</span>
                  <span className={s.channelValue}>{c.value}</span>
                </span>
                <span className={s.channelArrow}>{c.href ? "↗" : ""}</span>
              </>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className={s.channel}>
                {inner}
              </a>
            ) : (
              <div key={c.label} className={s.channel}>
                {inner}
              </div>
            );
          })}
        </Artboard.Body>
      </Artboard>

      <Artboard board={contactBoards.elsewhere} tone="night" pad={40}>
        <Artboard.Header pill="Online" aside={socials.map((x) => x.name).join(" · ")} />
        <Artboard.Title>Elsewhere</Artboard.Title>
        <Artboard.Rule />
        <Artboard.Body className={s.socials}>
          {socials.map((x) => {
            const Icon = socialIcons[x.icon];
            const inner = (
              <>
                <div className={s.socialTop}>
                  <Icon size={34} />
                  <span className={s.socialMark}>{x.href ? "↗" : "+"}</span>
                </div>
                <div>
                  <div className={s.socialLabel}>{x.label}</div>
                  <div className={s.socialName}>{x.name}</div>
                  <div className={s.socialHandle}>{x.display ?? "Add link"}</div>
                </div>
              </>
            );
            return x.href ? (
              <a key={x.name} href={x.href} target="_blank" rel="noopener" className={s.social}>
                {inner}
              </a>
            ) : (
              <div key={x.name} className={`${s.social} ${s.socialPending}`}>
                {inner}
              </div>
            );
          })}
        </Artboard.Body>
      </Artboard>

      <Artboard board={contactBoards.message} pad={40}>
        <div className={s.availability}>
          <span className={s.available}>
            <span className={s.availableDot} />
            {profile.status}
          </span>
          <div className={s.engagement}>
            {engagement.map((e) => (
              <span key={e}>{e}</span>
            ))}
          </div>
        </div>
        <h2 className={s.messageTitle}>Send a message</h2>
        <Artboard.Rule />
        <ContactForm />
      </Artboard>
    </>
  );
}
