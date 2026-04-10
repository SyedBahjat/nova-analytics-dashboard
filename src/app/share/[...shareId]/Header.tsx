import { LanguageButton } from '@/components/input/LanguageButton';
import { PreferencesButton } from '@/components/input/PreferencesButton';
import { Logo } from '@/components/svg';
import { Icon, Row, Text, ThemeButton } from '@/lib/ui';

export function Header() {
  return (
    <Row as="header" justifyContent="space-between" alignItems="center" paddingY="3">
      <a href="/" target="_self">
        <Row alignItems="center" gap>
          <Icon>
            <Logo />
          </Icon>
          <Text weight="bold">Nova Analytics</Text>
        </Row>
      </a>
      <Row alignItems="center" gap>
        <ThemeButton />
        <LanguageButton />
        <PreferencesButton />
      </Row>
    </Row>
  );
}
