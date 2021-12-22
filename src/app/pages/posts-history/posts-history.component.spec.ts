import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsHistoryComponent } from './posts-history.component';

describe('PostsHistoryComponent', () => {
  let component: PostsHistoryComponent;
  let fixture: ComponentFixture<PostsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
