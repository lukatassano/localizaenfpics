import { Map } from "../../Components/map";
import { PrivacyPolicyDialog } from "../../Components/politica-privacidade";
import { SelectedNurse } from "../../Components/selected-nurse";
import { SelectedNurses } from "../../Components/selected-nurses";
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
