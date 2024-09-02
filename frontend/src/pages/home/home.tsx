import { Map } from "../../components/map";
import { PrivacyPolicyDialog } from "../../components/politica-privacidade";
import { SelectedNurse } from "../../components/selected-nurse";
import { SelectedNurses } from "../../components/selected-nurses";
import { Form } from "../form/form";
import { Container } from "./styles";

export function Home() {
  return (
    <Container>
      <Map />
      <SelectedNurses />
      <SelectedNurse />

      <PrivacyPolicyDialog />
      <Form />
    </Container>
  );
}
