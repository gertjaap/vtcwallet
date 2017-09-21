import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
  private menuItems: { titleString : string, icon : string, link : string }[] =
  [
    { titleString : '_MENU_GETTINGSTARTED_', icon: 'icon-check', link : '/onboarding' },
    { titleString : '_MENU_DASHBOARD_', icon: 'fa fa-dashboard', link : '/dashboard' },
    { titleString : '_MENU_BLOCKCHAIN_WALLET_', icon: 'icon-wallet', link : '/blockchainwallet' },
    { titleString : '_MENU_LIGHTNING_WALLET_', icon: 'fa fa-bolt', link : '/lightningwallet' },
    { titleString : '_MENU_ATOMIC_SWAP_', icon: 'fa fa-retweet', link : '/atomicswap' },
    { titleString : '_MENU_MINE_', icon: 'fa fa-server', link : '/mine' },
    { titleString : '_MENU_BUY_', icon: 'fa fa-shopping-basket', link : '/buy' },
    { titleString : '_MENU_COMMUNITY_', icon: 'fa fa-users', link : '/community' },
    { titleString : '_MENU_DOCS_', icon: 'fa fa-book', link : '/docs' }

  ];
  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void {}
}
