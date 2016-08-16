import { CanActivateQuote } from './canActivateQuote';
import { ConfigResolveGuard } from './resolve_config_guard';
import { CanComponentDeactivate, CanDeactivateGuard} from './canDeactivateYourDetails';
export var GUARD_MODULES = [
	CanActivateQuote,
	ConfigResolveGuard,
	CanDeactivateGuard
];
