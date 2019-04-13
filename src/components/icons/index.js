import React from "react";
import triggerImg from "./trigger.svg";
import generalImg from "./general.svg";
import riseImg from "./rise.svg";
import balanceImg from "./balance.svg";
import institutionImg from "./institution.svg";
import PFinanceImg from "./PublicFinance.svg";
import BusinessEnvImg from "./BusinessEnv.svg";
import LabourImg from "./Labour.svg";
import SocialImg from "./Social.svg";
import EnvImg from "./environment.svg";
import InfraImg from "./infrastructure.svg";

import InternationalImg from "./ssqt.svg";
import SearchImg from "./ic-search.svg";
import EditImg from "./edit.svg";
import InfoImg from "./info.svg";
import { Icon } from "antd";
import BannerImg from "./ic-quoc-huy.png";

export { BannerImg };

export const TriggerIcon = props => (
	<Icon component={() => <img src={triggerImg} />} {...props} />
);

export const GeneralInfoIcon = props => (
	<Icon component={() => <img src={generalImg} />} {...props} />
);

export const RiseIcon = props => (
	<Icon component={() => <img src={riseImg} />} {...props} />
);

export const BalanceIcon = props => (
	<Icon component={() => <img src={balanceImg} />} {...props} />
);

export const FinanceIcon = props => (
	<Icon component={() => <img src={PFinanceImg} />} {...props} />
);

export const InstitutionIcon = props => (
	<Icon component={() => <img src={institutionImg} />} {...props} />
);

export const BusinessEnvIcon = props => (
	<Icon component={() => <img src={BusinessEnvImg} />} {...props} />
);

export const LabourIcon = props => (
	<Icon component={() => <img src={LabourImg} />} {...props} />
);

export const SocialIcon = props => (
	<Icon component={() => <img src={SocialImg} />} {...props} />
);

export const EnvIcon = props => (
	<Icon component={() => <img src={EnvImg} />} {...props} />
);

export const InfraIcon = props => (
	<Icon component={() => <img src={InfraImg} />} {...props} />
);

export const InternationalIcon = props => (
	<Icon
		component={() => (
			<img src={InternationalImg} width="50px" height="50px" />
		)}
		{...props}
	/>
);

export const SearchIcon = props => (
	<Icon component={() => <img src={SearchImg} />} {...props} />
);

export const InfoIcon = props => (
	<Icon component={() => <img src={InfoImg} />} {...props} />
);

export const EditIcon = props => (
	<Icon component={() => <img src={EditImg} />} {...props} />
);
