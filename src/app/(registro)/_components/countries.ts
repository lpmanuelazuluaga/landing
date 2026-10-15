import { AR, BO, BR, CA, CL, CO, CR, CU, DE, DO, EC, ES, FR, GB, GT, HN, IT, MX, NI, PA, PE, PR, PT, PY, SV, US, UY, VE } from "country-flag-icons/react/3x2";

/*
  Países del selector de prefijo de WhatsApp. Colombia primero (mercado
  principal) y el resto por nombre. Las banderas son SVG (country-flag-icons):
  los emojis de banderas no se ven en Windows.

  El valor del selector es el código ISO, no el prefijo: varios países
  comparten +1.
*/

export type Country = {
  iso: string;
  name: string;
  dial: string;
  Flag: typeof CO;
};

export const DEFAULT_COUNTRY = "CO";

export const COUNTRIES: readonly Country[] = [
  { iso: "CO", name: "Colombia", dial: "+57", Flag: CO },
  { iso: "DE", name: "Alemania", dial: "+49", Flag: DE },
  { iso: "AR", name: "Argentina", dial: "+54", Flag: AR },
  { iso: "BO", name: "Bolivia", dial: "+591", Flag: BO },
  { iso: "BR", name: "Brasil", dial: "+55", Flag: BR },
  { iso: "CA", name: "Canadá", dial: "+1", Flag: CA },
  { iso: "CL", name: "Chile", dial: "+56", Flag: CL },
  { iso: "CR", name: "Costa Rica", dial: "+506", Flag: CR },
  { iso: "CU", name: "Cuba", dial: "+53", Flag: CU },
  { iso: "EC", name: "Ecuador", dial: "+593", Flag: EC },
  { iso: "SV", name: "El Salvador", dial: "+503", Flag: SV },
  { iso: "ES", name: "España", dial: "+34", Flag: ES },
  { iso: "US", name: "Estados Unidos", dial: "+1", Flag: US },
  { iso: "FR", name: "Francia", dial: "+33", Flag: FR },
  { iso: "GT", name: "Guatemala", dial: "+502", Flag: GT },
  { iso: "HN", name: "Honduras", dial: "+504", Flag: HN },
  { iso: "IT", name: "Italia", dial: "+39", Flag: IT },
  { iso: "MX", name: "México", dial: "+52", Flag: MX },
  { iso: "NI", name: "Nicaragua", dial: "+505", Flag: NI },
  { iso: "PA", name: "Panamá", dial: "+507", Flag: PA },
  { iso: "PY", name: "Paraguay", dial: "+595", Flag: PY },
  { iso: "PE", name: "Perú", dial: "+51", Flag: PE },
  { iso: "PT", name: "Portugal", dial: "+351", Flag: PT },
  { iso: "PR", name: "Puerto Rico", dial: "+1", Flag: PR },
  { iso: "GB", name: "Reino Unido", dial: "+44", Flag: GB },
  { iso: "DO", name: "República Dominicana", dial: "+1", Flag: DO },
  { iso: "UY", name: "Uruguay", dial: "+598", Flag: UY },
  { iso: "VE", name: "Venezuela", dial: "+58", Flag: VE },
];

export function findCountry(iso: string): Country {
  return COUNTRIES.find((country) => country.iso === iso) ?? COUNTRIES[0];
}
