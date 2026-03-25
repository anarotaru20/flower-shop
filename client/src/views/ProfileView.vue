<template>
  <v-container class="py-8">
    <div class="profile-page">
      <v-row>
        <v-col cols="12" md="4" lg="3">
          <v-card class="profile-side" elevation="0">
            <v-card-text>
              <div class="profile-avatar-wrap">
                <v-avatar size="88" class="profile-avatar">
                  <span class="profile-avatar-text">
                    {{ initials }}
                  </span>
                </v-avatar>
              </div>

              <h2 class="profile-name">
                {{ displayName || 'Bloomera User' }}
              </h2>

              <p class="profile-email">
                {{ profileStore.profile.email || '-' }}
              </p>

              <v-divider class="my-4" />

              <div class="profile-menu">
                <button
                  class="menu-item"
                  :class="{ active: activeSection === 'account' }"
                  @click="activeSection = 'account'"
                >
                  Date personale
                </button>

                <button
                  class="menu-item"
                  :class="{ active: activeSection === 'orders' }"
                  @click="activeSection = 'orders'"
                >
                  Comenzile mele
                </button>

                <button
                  class="menu-item"
                  :class="{ active: activeSection === 'reminders' }"
                  @click="activeSection = 'reminders'"
                >
                  Notificări smart
                </button>

                <button
                  class="menu-item danger-menu-item"
                  :class="{ active: activeSection === 'delete-account' }"
                  @click="activeSection = 'delete-account'"
                >
                  Ștergere cont
                </button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8" lg="9">
          <v-card class="profile-card" elevation="0">
            <v-card-text>
              <v-alert
                v-if="
                  profileStore.error &&
                  (activeSection === 'account' || activeSection === 'delete-account')
                "
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ profileStore.error }}
              </v-alert>

              <v-alert
                v-if="ordersStore.error && activeSection === 'orders'"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ ordersStore.error }}
              </v-alert>

              <v-alert
                v-if="beneficiariesStore.error && activeSection === 'reminders'"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ beneficiariesStore.error }}
              </v-alert>

              <v-alert
                v-if="eventsStore.error && activeSection === 'reminders'"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ eventsStore.error }}
              </v-alert>

              <v-alert
                v-if="successMessage && activeSection === 'account'"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>

              <v-alert
                v-if="ordersSuccessMessage && activeSection === 'orders'"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ ordersSuccessMessage }}
              </v-alert>

              <template v-if="activeSection === 'account'">
                <div class="section-head">
                  <h2>Date personale</h2>
                  <p>Editează informațiile personale</p>
                  <v-divider class="my-4" />
                </div>

                <div v-if="profileStore.loading" class="loading-wrap">
                  <v-progress-circular indeterminate size="34" />
                </div>

                <v-form v-else @submit.prevent="handleProfileSubmit">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="profile-input-group">
                        <label class="profile-input-label" for="profile-first-name">Prenume</label>
                        <v-text-field
                          id="profile-first-name"
                          v-model="profileForm.first_name"
                          variant="outlined"
                          density="comfortable"
                          class="profile-field"
                          hide-details
                        />
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="profile-input-group">
                        <label class="profile-input-label" for="profile-last-name">Nume</label>
                        <v-text-field
                          id="profile-last-name"
                          v-model="profileForm.last_name"
                          variant="outlined"
                          density="comfortable"
                          class="profile-field"
                          hide-details
                        />
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="profile-input-group">
                        <label class="profile-input-label" for="profile-username">Username</label>
                        <v-text-field
                          id="profile-username"
                          v-model="profileForm.username"
                          variant="outlined"
                          density="comfortable"
                          class="profile-field"
                          hide-details
                        />
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="profile-input-group">
                        <label class="profile-input-label" for="profile-birth-date">
                          Data nașterii
                        </label>

                        <v-menu
                          v-model="birthDateMenu"
                          :close-on-content-click="false"
                          location="bottom"
                          offset="10"
                        >
<template #activator="{ props }">
  <v-text-field
    v-bind="props"
    id="profile-birth-date"
    :model-value="profileForm.birth_date ? formatBirthDate(profileForm.birth_date) : ''"
    placeholder="Selectează data"
    variant="outlined"
    density="comfortable"
    readonly
    hide-details
    class="profile-field birth-date-field"
    append-inner-icon="mdi-calendar-month-outline"
  />
</template>

                          <div class="birth-date-menu-card">
                            <v-date-picker
                              v-model="profileForm.birth_date"
                              hide-header
                              :max="maxBirthDate"
                              show-adjacent-months
                              @update:model-value="birthDateMenu = false"
                            />
                          </div>
                        </v-menu>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <div class="profile-input-group">
                        <label class="profile-input-label" for="profile-email">Email</label>
                        <v-text-field
                          id="profile-email"
                          :model-value="profileForm.email"
                          variant="outlined"
                          density="comfortable"
                          readonly
                          class="profile-field"
                          hide-details
                        />
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <div class="profile-input-group">
                        <label class="profile-input-label" for="profile-address">Adresă</label>
                        <v-textarea
                          id="profile-address"
                          v-model="profileForm.address"
                          variant="outlined"
                          density="comfortable"
                          rows="3"
                          auto-grow
                          class="profile-field"
                          hide-details
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <div class="actions">
                    <v-btn
                      type="submit"
                      class="save-btn"
                      :loading="profileStore.saving"
                      :disabled="profileStore.saving"
                    >
                      Salvează modificările
                    </v-btn>
                  </div>
                </v-form>
              </template>

              <template v-else-if="activeSection === 'orders'">
                <div class="section-head">
                  <h2>Comenzile mele</h2>
                  <p>Urmărește comenzile, facturile și statusul plăților.</p>
                  <v-divider class="my-4" />
                </div>

                <div v-if="ordersStore.loading" class="loading-wrap">
                  <v-progress-circular indeterminate size="34" />
                </div>

                <template v-else>
                  <div v-if="!decoratedOrders.length" class="empty-state">
                    <div class="empty-icon">🛍️</div>
                    <h4>Nu ai comenzi încă</h4>
                    <p>Aici vor apărea toate comenzile tale.</p>
                  </div>

                  <div v-else class="orders-list">
                    <div
                      v-for="order in decoratedOrders"
                      :key="order.id"
                      class="order-history-card"
                    >
                      <div class="order-history-top">
                        <div class="order-history-left">
                          <h3>Comanda #{{ order.invoice_number }}</h3>
                          <p>Plasată pe {{ formatOrderShortDate(order.created_at) }}</p>
                        </div>

                        <div class="order-history-right">
                          <span class="order-status-badge" :class="`status-${order.status}`">
                            {{ formatOrderStatus(order.status) }}
                          </span>
                        </div>
                      </div>

                      <v-divider class="my-4" />

                      <div class="order-history-bottom">
                        <div class="order-history-meta">
                          <span>{{ order.order_items?.length || 0 }} produse</span>
                        </div>

                        <div class="order-history-total">
                          {{ formatPrice(order.total) }}
                        </div>
                      </div>

                      <div class="order-history-actions">
                        <v-btn
                          variant="outlined"
                          class="invoice-outline-btn"
                          @click="openInvoiceDialog(order)"
                        >
                          Detalii factura
                        </v-btn>

                        <v-btn
                          variant="flat"
                          class="invoice-solid-btn"
                          @click="handleDownloadInvoice(order.id, order.invoice_number)"
                        >
                          Descarcă factura
                        </v-btn>

                        <v-btn
                          v-if="order.status === 'pending'"
                          variant="text"
                          class="cancel-order-btn"
                          @click="handleCancelOrder(order.id)"
                        >
                          Anulează comanda
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </template>
              </template>

              <template v-else-if="activeSection === 'reminders'">
                <div class="section-head">
                  <h2>Notificări smart</h2>
                  <p>Gestionează beneficiarii, evenimentele și preferințele salvate.</p>
                </div>

                <v-divider class="my-4" />

                <div v-if="remindersLoading" class="loading-wrap">
                  <v-progress-circular indeterminate size="34" />
                </div>

                <template v-else>
                  <div class="smart-stack">
                    <section class="smart-section">
                      <div class="smart-section-top">
                        <div class="smart-section-copy">
                          <h3>Evenimente</h3>
                          <p>Zile de naștere, aniversări și momente speciale</p>
                        </div>

                        <div class="smart-section-actions">
                          <v-btn
                            class="smart-secondary-btn"
                            @click="showEventsList = !showEventsList"
                          >
                            {{
                              showEventsList ? 'Ascunde lista evenimentelor' : 'Lista evenimentelor'
                            }}
                          </v-btn>
                          <v-btn class="smart-action-btn" @click="openAddEventDialog">
                            Adaugă eveniment
                          </v-btn>
                        </div>
                      </div>

                      <v-expand-transition>
                        <div v-if="showEventsList" class="smart-list-wrap">
                          <div
                            v-if="!eventsStore.list.length"
                            class="empty-state compact-empty-state"
                          >
                            <div class="empty-icon">📅</div>
                            <h4>Nu ai evenimente încă</h4>
                            <p>Creează un eveniment și leagă-l de un beneficiar.</p>
                          </div>

                          <div v-else class="cards-list">
                            <div
                              v-for="event in eventsStore.list"
                              :key="event.id"
                              class="entity-card entity-card-clickable"
                              @click="openViewEventDialog(event)"
                            >
                              <div class="entity-card-top">
                                <div>
                                  <h4>
                                    {{ eventTypeIcon(event.event_type) }}
                                    {{ beautifyEventType(event.event_type) }} -
                                    {{ getBeneficiaryName(event.beneficiary_id) }}
                                  </h4>
                                  <div class="event-preview-date">
                                    <span class="event-date-icon">📅</span>
                                    <span>{{ formatEventDate(event.event_date) }}</span>
                                  </div>
                                </div>

                                <div class="entity-actions">
                                  <v-btn
                                    size="small"
                                    variant="text"
                                    class="text-btn danger-btn"
                                    @click.stop="handleDeleteEvent(event)"
                                  >
                                    <v-icon>mdi-delete-outline</v-icon>
                                  </v-btn>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-expand-transition>
                    </section>

                    <v-divider class="smart-divider" />

                    <section class="smart-section">
                      <div class="smart-section-top">
                        <div class="smart-section-copy">
                          <h3>Persoane</h3>
                          <p>Persoane salvate și preferințele lor florale</p>
                        </div>

                        <div class="smart-section-actions">
                          <v-btn
                            class="smart-secondary-btn"
                            @click="showBeneficiariesList = !showBeneficiariesList"
                          >
                            {{
                              showBeneficiariesList
                                ? 'Ascunde lista persoanelor'
                                : 'Lista persoanelor'
                            }}
                          </v-btn>
                          <v-btn class="smart-action-btn" @click="openAddBeneficiaryDialog">
                            Adaugă persoană
                          </v-btn>
                        </div>
                      </div>

                      <v-expand-transition>
                        <div v-if="showBeneficiariesList" class="smart-list-wrap">
                          <div
                            v-if="!beneficiariesStore.list.length"
                            class="empty-state compact-empty-state"
                          >
                            <div class="empty-icon">💐</div>
                            <h4>Nu ai persoane încă</h4>
                            <p>Adaugă prima persoană pentru a salva preferințele ei.</p>
                          </div>

                          <div v-else class="cards-list">
                            <div
                              v-for="beneficiary in beneficiariesStore.list"
                              :key="beneficiary.id"
                              class="entity-card entity-card-clickable"
                              @click="openViewBeneficiaryDialog(beneficiary)"
                            >
                              <div class="entity-card-top">
                                <div>
                                  <h4>{{ beneficiary.name }}</h4>
                                  <p>{{ beneficiary.relationship || 'Fără relație adăugată' }}</p>
                                </div>
                                <div class="entity-actions">
                                  <v-btn
                                    size="small"
                                    variant="text"
                                    class="text-btn danger-btn"
                                    @click.stop="handleDeleteBeneficiary(beneficiary)"
                                  >
                                    <v-icon>mdi-delete-outline</v-icon>
                                  </v-btn>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-expand-transition>
                    </section>
                  </div>
                </template>
              </template>

              <template v-else-if="activeSection === 'delete-account'">
                <div class="section-head">
                  <h2>Ștergere cont</h2>
                  <p>Înainte să continui, citește cu atenție informațiile de mai jos.</p>
                  <v-divider class="my-4" />
                </div>

                <div class="delete-account-panel">
                  <div class="delete-account-banner">
                    <div class="delete-icon-wrap">
                      <v-icon size="28">mdi-alert-circle-outline</v-icon>
                    </div>

                    <div>
                      <h3>Această acțiune este permanentă</h3>
                      <p>După ștergerea contului, datele tale nu vor mai putea fi recuperate.</p>
                    </div>
                  </div>

                  <div class="delete-warning-list">
                    <div class="delete-warning-card">
                      <h4>Ce se va întâmpla</h4>
                      <ul>
                        <li>Contul tău va fi șters definitiv.</li>
                        <li>Datele de profil vor fi eliminate.</li>
                        <li>Preferințele, beneficiarii și evenimentele salvate vor dispărea.</li>
                        <li>Nu vei mai putea accesa istoricul din cont după confirmare.</li>
                      </ul>
                    </div>

                    <div class="delete-warning-card soft">
                      <h4>Verifică înainte</h4>
                      <ul>
                        <li>Descarcă facturile de care mai ai nevoie.</li>
                        <li>Asigură-te că nu mai ai comenzi importante în așteptare.</li>
                        <li>Verifică dacă vrei doar să ieși din cont, nu să îl ștergi complet.</li>
                      </ul>
                    </div>
                  </div>

                  <div class="delete-confirm-box">
                    <p>
                      Dacă ești sigură că vrei să continui, apasă butonul de mai jos. Vei primi încă
                      o confirmare finală.
                    </p>

                    <v-btn
                      class="delete-account-btn"
                      :loading="profileStore.deleting"
                      :disabled="profileStore.deleting"
                      @click="handleDeleteAccount"
                    >
                      Șterge contul meu definitiv
                    </v-btn>
                  </div>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="beneficiaryDialog" max-width="760">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          {{ beneficiaryEditId ? 'Editează persoană' : 'Adaugă o persoană' }}
        </v-card-title>

        <v-card-text class="dialog-body">
          <v-form @submit.prevent="handleSaveBeneficiary">
            <v-row>
              <v-col cols="12" md="6">
                <label class="profile-input-label" for="profile-first-name">Nume</label>
                <v-text-field
                  v-model="beneficiaryForm.name"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="6">
                <label class="profile-input-label" for="profile-first-name">Relație</label>
                <v-select
                  v-model="beneficiaryForm.relationship"
                  :items="relationshipOptions"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  hide-selected
                  allow-new
                  :rules="[(v) => !!v || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="6">
                <label class="profile-input-label" for="profile-first-name">Culori preferate</label>
                <v-text-field
                  v-model="beneficiaryForm.preferred_colors_text"
                  hint="ex: roz, alb, albastru"
                  persistent-hint
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="6">
                <label class="profile-input-label" for="profile-first-name">Stil preferat</label>
                <v-select
                  v-model="beneficiaryForm.preferred_style"
                  :items="styleOptions"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="6">
                <label class="profile-input-label" for="profile-first-name">Tip preferat</label>
                <v-text-field
                  v-model="beneficiaryForm.preferred_product_type"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => (v !== null && v !== '') || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="3">
                <label class="profile-input-label" for="profile-first-name">Buget min.</label>
                <v-text-field
                  v-model="beneficiaryForm.budget_min"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => (v !== null && v !== '') || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="3">
                <label class="profile-input-label" for="profile-first-name">Buget max.</label>
                <v-text-field
                  v-model="beneficiaryForm.budget_max"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => (v !== null && v !== '') || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12">
                <label class="profile-input-label" for="profile-first-name">Descriere</label>
                <v-textarea
                  v-model="beneficiaryForm.notes"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                />
              </v-col>

              <v-col cols="12">
                <div class="quiz-helper">
                  <div class="quiz-helper-text">
                    <h4>Nu știi ce să completezi?</h4>
                    <p>
                      Te ajutăm cu câteva întrebări rapide și îți sugerăm automat preferințele
                      beneficiarului.
                    </p>
                  </div>

                  <v-btn
                    variant="outlined"
                    class="quiz-helper-btn"
                    @click="beneficiaryQuizDialog = true"
                  >
                    Începe quiz-ul
                  </v-btn>
                </div>
              </v-col>
            </v-row>

            <div class="dialog-actions">
              <v-btn class="close-btn" variant="text" @click="closeBeneficiaryDialog"
                >Închide</v-btn
              >
              <v-btn
                type="submit"
                class="save-btn"
                :loading="beneficiariesStore.saving"
                :disabled="!isBeneficiaryFormValid"
              >
                Salvează
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="beneficiaryViewDialog" max-width="760">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">Detalii beneficiar</v-card-title>

        <v-card-text v-if="selectedBeneficiary" class="dialog-body">
          <div class="detail-view-head">
            <h3>{{ selectedBeneficiary.name }}</h3>
            <p>{{ selectedBeneficiary.relationship || 'Fără relație adăugată' }}</p>
          </div>

          <div class="detail-view-grid">
            <div class="detail-view-block">
              <span class="detail-view-label">Culori preferate</span>
              <div class="chips-wrap">
                <span class="detail-view-value">
                  {{
                    selectedBeneficiary.preferred_colors &&
                    selectedBeneficiary.preferred_colors.length
                      ? selectedBeneficiary.preferred_colors.join(', ')
                      : '-'
                  }}
                </span>
                <span
                  v-if="
                    !selectedBeneficiary.preferred_colors ||
                    !selectedBeneficiary.preferred_colors.length
                  "
                  class="detail-view-empty"
                >
                  -
                </span>
              </div>
            </div>

            <div class="detail-view-block">
              <span class="detail-view-label">Stil preferat</span>
              <span class="detail-view-value">{{
                selectedBeneficiary.preferred_style || '-'
              }}</span>
            </div>

            <div class="detail-view-block">
              <span class="detail-view-label">Tip preferat</span>
              <span class="detail-view-value">
                {{ selectedBeneficiary.preferred_product_type || '-' }}
              </span>
            </div>

            <div class="detail-view-block">
              <span class="detail-view-label">Buget</span>
              <span class="detail-view-value">
                {{ formatBudget(selectedBeneficiary.budget_min, selectedBeneficiary.budget_max) }}
              </span>
            </div>

            <div class="detail-view-block detail-view-block-full">
              <span class="detail-view-label">Descriere</span>
              <span class="detail-view-value">{{ selectedBeneficiary.notes || '-' }}</span>
            </div>
          </div>

          <div class="dialog-actions">
            <v-btn class="close-btn" variant="text" @click="beneficiaryViewDialog = false">
              Închide
            </v-btn>
            <v-btn class="save-btn" @click="openEditFromViewBeneficiary">Editează</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="eventViewDialog" max-width="760">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">Detalii eveniment</v-card-title>

        <v-card-text v-if="selectedEvent" class="dialog-body">
          <div class="detail-view-head">
            <h3>
              {{ eventTypeIcon(selectedEvent.event_type) }}
              {{ beautifyEventType(selectedEvent.event_type) }}
            </h3>
          </div>

          <div class="detail-view-grid">
            <div class="detail-view-block">
              <span class="detail-view-label">Beneficiar</span>
              <span class="detail-view-value">
                {{ getBeneficiaryName(selectedEvent.beneficiary_id) }}
              </span>
            </div>

            <div class="detail-view-block">
              <span class="detail-view-label">Data evenimentului</span>
              <span class="detail-view-value">{{ formatEventDate(selectedEvent.event_date) }}</span>
            </div>

            <div class="detail-view-block detail-view-block-full">
              <span class="detail-view-label">Reminder</span>
              <span class="detail-view-value">
                {{ selectedEvent.reminder_days_before ?? 4 }} zile înainte
              </span>
            </div>

            <div class="detail-view-block detail-view-block-full">
              <span class="detail-view-label">Descriere</span>
              <span class="detail-view-value">{{ selectedEvent.notes || '-' }}</span>
            </div>
          </div>

          <div class="dialog-actions">
            <v-btn class="close-btn" variant="text" @click="eventViewDialog = false">
              Închide
            </v-btn>
            <v-btn class="save-btn" @click="openEditFromViewEvent">Editează</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="eventDialog" max-width="760">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          {{ eventEditId ? 'Editează evenimentul' : 'Adaugă un eveniment' }}
        </v-card-title>

        <v-card-text class="dialog-body">
          <v-form @submit.prevent="handleSaveEvent">
            <v-row>
              <v-col cols="12" md="8">
                <label class="profile-input-label" for="profile-first-name">Persoana</label>
                <v-select
                  v-model="eventForm.beneficiary_id"
                  :items="beneficiaryOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex align-center">
                <v-btn
                  block
                  variant="outlined"
                  class="inline-add-btn"
                  @click="openAddBeneficiaryFromEvent"
                >
                  Adaugă persoană
                </v-btn>
              </v-col>

              <v-col cols="12" md="4">
                <label class="profile-input-label" for="profile-first-name">Tip eveniment</label>
                <v-select
                  v-model="eventForm.event_type"
                  :items="eventTypeOptions"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12" md="4">
                <label class="profile-input-label">Data evenimentului</label>

                <v-menu
                  v-model="menuDate"
                  :close-on-content-click="false"
                  offset-y
                  content-class="compact-date-menu"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :model-value="formattedEventDate"
                      placeholder="dd.mm.yyyy"
                      variant="outlined"
                      density="comfortable"
                      readonly
                      append-inner-icon="mdi-calendar"
                      :rules="[(v) => !!eventForm.event_date || 'Campul trebuie completat']"
                    />
                  </template>

                  <v-date-picker
                    v-model="eventForm.event_date"
                    hide-header
                    show-adjacent-months
                    @update:modelValue="menuDate = false"
                    class="compact-date-picker"
                  />
                </v-menu>
              </v-col>

              <v-col cols="12" md="4">
                <label class="profile-input-label" for="profile-first-name"
                  >Reminder cu X zile înainte</label
                >
                <v-text-field
                  v-model="eventForm.reminder_days_before"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Campul trebuie completat']"
                />
              </v-col>

              <v-col cols="12">
                <label class="profile-input-label" for="profile-first-name">Descriere</label>
                <v-textarea
                  v-model="eventForm.notes"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                />
              </v-col>
            </v-row>

            <div class="dialog-actions">
              <v-btn class="close-btn" variant="text" @click="closeEventDialog">Închide</v-btn>
              <v-btn
                type="submit"
                class="save-btn"
                :loading="eventsStore.saving"
                :disabled="eventsStore.saving || !isEventFormValid"
              >
                Salvează
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog.open" max-width="520" persistent class="confirm-dialog">
      <div class="confirm-overlay">
        <v-card class="confirm-card" elevation="0">
          <div class="confirm-icon">
            <v-icon size="28">{{ confirmDialog.icon }}</v-icon>
          </div>

          <h3 class="confirm-title">{{ confirmDialog.title }}</h3>
          <p class="confirm-text">{{ confirmDialog.text }}</p>

          <div class="confirm-actions">
            <v-btn variant="text" class="confirm-cancel-btn" @click="closeConfirmDialog">
              {{ confirmDialog.cancelText }}
            </v-btn>

            <v-btn
              class="confirm-submit-btn"
              :class="{ danger: confirmDialog.variant === 'danger' }"
              @click="confirmAction"
            >
              {{ confirmDialog.confirmText }}
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-dialog>

    <v-dialog v-model="invoiceDialog" max-width="760">
      <v-card class="invoice-modal-card">
        <div v-if="selectedInvoiceOrder" class="invoice-classic">
          <div class="invoice-classic-header">
            <div class="invoice-classic-header-left">
              <h2>Factură Fiscală</h2>
              <p>Seria EP Nr. {{ selectedInvoiceOrder.invoice_number }}</p>
            </div>

            <div class="invoice-classic-header-right">
              <div>
                <strong>Data:</strong> {{ formatInvoiceDate(selectedInvoiceOrder.created_at) }}
              </div>
              <div>
                <strong>Status:</strong>
                <span
                  class="invoice-classic-status"
                  :class="`status-${selectedInvoiceOrder.payment_status} `"
                >
                   {{ formatPaymentStatusInvoice(selectedInvoiceOrder.payment_status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="invoice-classic-body">
          <div class="invoice-classic-parties">
            <div class="invoice-classic-party">
              <h4>FURNIZOR:</h4>
              <p><strong>Bloomera SRL</strong></p>
              <p>CUI: RO12345678</p>
              <p>str. Florilor, nr. 14, Bucuresti, Romania</p>
            </div>

            <div class="invoice-classic-party client">
              <h4>CLIENT:</h4>
              <p>
                <strong>{{ displayName || 'Client Bloomera' }}</strong>
              </p>
              <p>{{ profileStore.profile.email || '-' }}</p>
              <p>{{ profileStore.profile.address || 'Adresă nespecificată' }}</p>
            </div>
          </div>

          <div class="invoice-classic-divider"></div>

          <div class="invoice-classic-table-wrap">
            <table class="invoice-classic-table">
              <thead>
                <tr>
                  <th>Produs</th>
                  <th>Cant.</th>
                  <th>Preț unitar</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in selectedInvoiceOrder.order_items" :key="item.id">
                  <td>{{ item.product_name || item.products?.name || 'Produs' }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td>{{ formatPrice(item.lineTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="invoice-classic-summary">
            <template v-if="selectedInvoiceOrder.hasDiscount">
              <div class="invoice-classic-summary-row">
                <span>Subtotal inițial:</span>
                <strong>{{ formatPrice(selectedInvoiceOrder.originalSubtotal) }}</strong>
              </div>

              <div class="invoice-classic-summary-row invoice-classic-summary-discount">
                <span>Reducere:</span>
                <strong>-{{ formatPrice(selectedInvoiceOrder.discountAmount) }}</strong>
              </div>

              <div class="invoice-classic-summary-row">
                <span>Subtotal redus:</span>
                <strong>{{ formatPrice(selectedInvoiceOrder.finalSubtotal) }}</strong>
              </div>
            </template>

            <div v-if="invoiceTaxesAmount > 0" class="invoice-classic-summary-row">
              <span>Taxe:</span>
              <strong>{{ formatPrice(invoiceTaxesAmount) }}</strong>
            </div>

            <div class="invoice-classic-total-box">
              <span>TOTAL DE PLATĂ:</span>
              <strong>{{ formatPrice(selectedInvoiceOrder.total) }}</strong>
            </div>
          </div>

          <div class="invoice-classic-actions">
            <v-btn
              class="invoice-pdf-btn"
              @click="
                handleDownloadInvoice(selectedInvoiceOrder.id, selectedInvoiceOrder.invoice_number)
              "
            >
              Descarcă PDF
            </v-btn>

            <v-btn class="invoice-close-btn" @click="invoiceDialog = false"> Închide </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <BeneficiaryQuizDialog v-model="beneficiaryQuizDialog" @complete="handleQuizComplete" />

    <v-snackbar v-model="snackbar.show" :timeout="3000" location="bottom right" color="success">
      {{ snackbar.text }}

      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Închide</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/profile.css'
import BeneficiaryQuizDialog from '@/components/profile/BeneficiaryQuizDialog.vue'
import { useProfileStore } from '@/stores/profile'
import { useBeneficiariesStore } from '@/stores/beneficiaries'
import { useEventsStore } from '@/stores/events'
import { useOrdersStore } from '@/stores/orders'

const router = useRouter()
const profileStore = useProfileStore()
const beneficiariesStore = useBeneficiariesStore()
const eventsStore = useEventsStore()
const ordersStore = useOrdersStore()

const beneficiaryViewDialog = ref(false)
const eventViewDialog = ref(false)
const selectedBeneficiary = ref(null)
const selectedEvent = ref(null)

const beneficiaryQuizDialog = ref(false)
const activeSection = ref('account')
const successMessage = ref('')
const reminderSuccessMessage = ref('')
const ordersSuccessMessage = ref('')
const birthDateMenu = ref(false)

const beneficiaryDialog = ref(false)
const beneficiaryEditId = ref(null)

const eventDialog = ref(false)
const eventEditId = ref(null)

const showEventsList = ref(true)
const showBeneficiariesList = ref(false)

const menuDate = ref(false)

const formattedEventDate = computed(() => {
  if (!eventForm.event_date) return ''

  const d = new Date(eventForm.event_date)

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
})

const invoiceTaxesAmount = computed(() => {
  if (!selectedInvoiceOrder.value) return 0

  const total = Number(selectedInvoiceOrder.value.total || 0)
  const base = selectedInvoiceOrder.value.hasDiscount
    ? Number(selectedInvoiceOrder.value.finalSubtotal || 0)
    : Number(
        selectedInvoiceOrder.value.total_without_taxes ||
          selectedInvoiceOrder.value.subtotal ||
          total,
      )

  const taxes = total - base
  return taxes > 0 ? Number(taxes.toFixed(2)) : 0
})

function formatInvoiceDate(date) {
  return new Date(date).toLocaleDateString('ro-RO')
}

function formatPaymentStatusInvoice(status) {
  if (status === 'paid') return 'Achitată'
  if (status === 'unpaid') return 'Neachitată'
  return '-'
}

function formatInvoicePaymentStatus(status) {
  const map = {
    paid: 'Achitată',
    pending: 'În așteptare',
    failed: 'Eșuată',
    refunded: 'Rambursată',
  }

  return map[status] || status || '-'
}

const snackbar = reactive({
  show: false,
  text: '',
})

function formatPaymentStatus(status) {
  const map = {
    paid: 'Plătită',
    pending: 'În așteptare',
    failed: 'Eșuată',
    refunded: 'Rambursată',
  }

  return map[status] || status || '-'
}
const confirmDialog = reactive({
  open: false,
  title: '',
  text: '',
  confirmText: 'Confirmă',
  cancelText: 'Renunță',
  variant: 'danger',
  icon: 'mdi-alert-circle-outline',
  onConfirm: null,
})

const profileForm = reactive({
  username: '',
  first_name: '',
  last_name: '',
  birth_date: '',
  address: '',
  email: '',
})

const beneficiaryForm = reactive({
  name: '',
  relationship: '',
  preferred_colors_text: '',
  preferred_style: '',
  preferred_product_type: '',
  budget_min: '',
  budget_max: '',
  notes: '',
})

const isEventFormValid = computed(
  () =>
    !!eventForm.beneficiary_id &&
    !!eventForm.event_type &&
    !!eventForm.event_date &&
    eventForm.reminder_days_before !== '' &&
    eventForm.reminder_days_before !== null,
)
const isBeneficiaryFormValid = computed(
  () =>
    beneficiaryForm.name &&
    beneficiaryForm.relationship &&
    beneficiaryForm.preferred_colors_text &&
    beneficiaryForm.preferred_style &&
    beneficiaryForm.preferred_product_type &&
    beneficiaryForm.budget_min !== '' &&
    beneficiaryForm.budget_max !== '',
)

const eventForm = reactive({
  beneficiary_id: '',
  event_type: '',
  event_date: '',
  reminder_days_before: 4,
  notes: '',
})

const relationshipEventTypeMap = {
  Prieten: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Prietenă: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Iubit: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare ', value: 'anniversary' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Valentine’s Day ', value: 'valentines_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Iubită: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare ', value: 'anniversary' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Valentine’s Day ', value: 'valentines_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Soț: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare ', value: 'anniversary' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Valentine’s Day ', value: 'valentines_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Soție: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare ', value: 'anniversary' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Valentine’s Day ', value: 'valentines_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Mamă: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: '8 Martie ', value: 'womens_day' },
    { title: 'Ziua mamei ', value: 'mothers_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Tată: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Ziua tatălui ', value: 'fathers_day' },
    { title: 'Sărbătoare', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Bunică: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: '8 Martie ', value: 'womens_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Bunic: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Soră: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: '8 Martie ', value: 'womens_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Frate: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  'Coleg de muncă': [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare în companie ', value: 'work_anniversary' },
    { title: 'Promovare ', value: 'promotion' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Secret Santa ', value: 'secret_santa' },
    { title: 'Plecare din firmă ', value: 'farewell' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  'Colegă de muncă': [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare în companie ', value: 'work_anniversary' },
    { title: 'Promovare ', value: 'promotion' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Secret Santa ', value: 'secret_santa' },
    { title: 'Plecare din firmă ', value: 'farewell' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Șef: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare în companie ', value: 'work_anniversary' },
    { title: 'Promovare ', value: 'promotion' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Șefă: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare în companie ', value: 'work_anniversary' },
    { title: 'Promovare ', value: 'promotion' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Profesor: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Absolvire ', value: 'graduation' },
    { title: 'Mulțumire ', value: 'thank_you' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Profesoară: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: '8 Martie ', value: 'womens_day' },
    { title: 'Absolvire ', value: 'graduation' },
    { title: 'Mulțumire ', value: 'thank_you' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Naș: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare ', value: 'anniversary' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Nașă: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare ', value: 'anniversary' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: '8 Martie ', value: 'womens_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Client: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare colaborare ', value: 'collaboration_anniversary' },
    { title: 'Promovare ', value: 'promotion' },
    { title: 'Mulțumire ', value: 'thank_you' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
  Altul: [
    { title: 'Zi de naștere ', value: 'birthday' },
    { title: 'Aniversare ', value: 'anniversary' },
    { title: 'Onomastică ', value: 'name_day' },
    { title: 'Sărbătoare ', value: 'holiday' },
    { title: 'Alt eveniment ', value: 'custom' },
  ],
}

const defaultEventTypeOptions = [
  { title: 'Zi de naștere', value: 'birthday' },
  { title: 'Aniversare', value: 'anniversary' },
  { title: 'Onomastică', value: 'name_day' },
  { title: 'Sărbătoare', value: 'holiday' },
  { title: 'Alt eveniment', value: 'custom' },
]

const eventTypeOptions = computed(() => {
  const beneficiary = beneficiariesStore.list.find((item) => item.id === eventForm.beneficiary_id)

  const relationship = beneficiary?.relationship
  return relationshipEventTypeMap[relationship] || defaultEventTypeOptions
})

const maxBirthDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const remindersLoading = computed(() => beneficiariesStore.loading || eventsStore.loading)

const beneficiaryOptions = computed(() =>
  beneficiariesStore.list.map((beneficiary) => ({
    title: beneficiary.name,
    value: beneficiary.id,
  })),
)

const decoratedOrders = computed(() => {
  return (ordersStore.orders || []).map((order) => {
    const decoratedItems = (order.order_items || []).map((item) => {
      const currentPrice = Number(item.price || 0)
      const originalPrice = Number(item.products?.price || item.price || 0)
      const quantity = Number(item.quantity || 0)
      const hasDiscount = originalPrice > currentPrice
      const discountPercent = hasDiscount
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0

      return {
        ...item,
        originalPrice,
        hasDiscount,
        discountPercent,
        lineTotal: currentPrice * quantity,
        originalLineTotal: originalPrice * quantity,
      }
    })

    const originalSubtotal = decoratedItems.reduce((sum, item) => sum + item.originalLineTotal, 0)
    const finalSubtotal = decoratedItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const discountAmount = Number((originalSubtotal - finalSubtotal).toFixed(2))
    const hasDiscount = discountAmount > 0

    return {
      ...order,
      order_items: decoratedItems,
      originalSubtotal,
      finalSubtotal,
      discountAmount,
      hasDiscount,
    }
  })
})

const displayName = computed(() => {
  const first = profileStore.profile.first_name || ''
  const last = profileStore.profile.last_name || ''
  return `${first} ${last}`.trim() || profileStore.profile.username || ''
})

const relationshipOptions = [
  'Prieten',
  'Prietenă',
  'Iubit',
  'Iubită',
  'Soț',
  'Soție',
  'Mamă',
  'Tată',
  'Bunică',
  'Bunic',
  'Soră',
  'Frate',
  'Coleg de muncă',
  'Colegă de muncă',
  'Șef',
  'Șefă',
  'Profesor',
  'Profesoară',
  'Parinți',
  'Naș',
  'Nașă',
  'Client',
  'Altul',
]

const styleOptions = [
  'Romantic',
  'Elegant',
  'Clasic',
  'Modern',
  'Minimalist',
  'Colorat',
  'Delicat',
  'Luxos',
  'Rustic',
  'Natural',
  'Exotic',
  'Jucăuș',
  'Rafinant',
  'Boem',
  'Altul',
]

const initials = computed(() => {
  const source = displayName.value || profileStore.profile.email || 'B'

  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
})

function formatBirthDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('ro-RO')
}

function syncProfileForm() {
  profileForm.username = profileStore.profile.username || ''
  profileForm.first_name = profileStore.profile.first_name || ''
  profileForm.last_name = profileStore.profile.last_name || ''
  profileForm.birth_date = profileStore.profile.birth_date || ''
  profileForm.address = profileStore.profile.address || ''
  profileForm.email = profileStore.profile.email || ''
}

function resetBeneficiaryForm() {
  beneficiaryForm.name = ''
  beneficiaryForm.relationship = ''
  beneficiaryForm.preferred_colors_text = ''
  beneficiaryForm.preferred_style = ''
  beneficiaryForm.preferred_product_type = ''
  beneficiaryForm.budget_min = ''
  beneficiaryForm.budget_max = ''
  beneficiaryForm.notes = ''
}

function resetEventForm() {
  eventForm.beneficiary_id = ''
  eventForm.event_type = ''
  eventForm.event_date = ''
  eventForm.reminder_days_before = 4
  eventForm.notes = ''
}

function parseColors(text) {
  return String(text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const formatEventDatePick = (date) => {
  if (!date) return ''

  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

function formatBudget(min, max) {
  const hasMin = min !== null && min !== undefined && min !== ''
  const hasMax = max !== null && max !== undefined && max !== ''

  if (hasMin && hasMax) return `${min} - ${max} RON`
  if (hasMin) return `from ${min} RON`
  if (hasMax) return `up to ${max} RON`
  return '-'
}

function formatPrice(val) {
  return `${Number(val).toFixed(2)} lei`
}

function formatDate(date) {
  return new Date(date).toLocaleString('ro-RO')
}

function beautifyEventType(value) {
  const map = {
    birthday: 'Zi de naștere',
    anniversary: 'Aniversare',
    holiday: 'Sărbătoare',
    custom: 'Eveniment personalizat',
  }

  return map[value] || 'Eveniment'
}

function getBeneficiaryName(beneficiaryId) {
  const beneficiary = beneficiariesStore.list.find((item) => item.id === beneficiaryId)
  return beneficiary?.name || 'Beneficiar necunoscut'
}

function openConfirmDialog({
  title,
  text,
  confirmText = 'Confirmă',
  cancelText = 'Renunță',
  variant = 'danger',
  icon = 'mdi-alert-circle-outline',
  onConfirm,
}) {
  confirmDialog.title = title
  confirmDialog.text = text
  confirmDialog.confirmText = confirmText
  confirmDialog.cancelText = cancelText
  confirmDialog.variant = variant
  confirmDialog.icon = icon
  confirmDialog.onConfirm = onConfirm
  confirmDialog.open = true
}

function closeConfirmDialog() {
  confirmDialog.open = false
  confirmDialog.title = ''
  confirmDialog.text = ''
  confirmDialog.confirmText = 'Confirmă'
  confirmDialog.cancelText = 'Renunță'
  confirmDialog.variant = 'danger'
  confirmDialog.icon = 'mdi-alert-circle-outline'
  confirmDialog.onConfirm = null
}

async function confirmAction() {
  const action = confirmDialog.onConfirm
  closeConfirmDialog()
  if (typeof action === 'function') {
    await action()
  }
}

function openAddBeneficiaryDialog() {
  reminderSuccessMessage.value = ''
  beneficiaryEditId.value = null
  resetBeneficiaryForm()
  beneficiaryDialog.value = true
}

function handleQuizComplete(result) {
  beneficiaryForm.preferred_colors_text = Array.isArray(result.preferred_colors)
    ? result.preferred_colors.join(', ')
    : ''
  beneficiaryForm.preferred_style = result.preferred_style || ''
  beneficiaryForm.preferred_product_type = result.preferred_product_type || ''
  beneficiaryForm.budget_min = result.budget_min ?? ''
  beneficiaryForm.budget_max = result.budget_max ?? ''
}

function formatEventDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  return date.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function eventTypeIcon(value) {
  const map = {
    birthday: '🎂',
    anniversary: '💕',
    holiday: '✨',
    custom: '📌',
    name_day: '🎉',
    valentines_day: '❤️',
    womens_day: '🌷',
    mothers_day: '💐',
    fathers_day: '👔',
    work_anniversary: '🏢',
    promotion: '📈',
    secret_santa: '🎁',
    farewell: '👋',
    graduation: '🎓',
    thank_you: '🙏',
    collaboration_anniversary: '🤝',
  }

  return map[value] || '✨'
}

function openViewBeneficiaryDialog(beneficiary) {
  selectedBeneficiary.value = beneficiary
  beneficiaryViewDialog.value = true
}

function openViewEventDialog(event) {
  selectedEvent.value = event
  eventViewDialog.value = true
}

function openEditFromViewBeneficiary() {
  const beneficiary = selectedBeneficiary.value
  beneficiaryViewDialog.value = false
  if (beneficiary) {
    openEditBeneficiaryDialog(beneficiary)
  }
}

function openEditFromViewEvent() {
  const event = selectedEvent.value
  eventViewDialog.value = false
  if (event) {
    openEditEventDialog(event)
  }
}

function openEditBeneficiaryDialog(beneficiary) {
  reminderSuccessMessage.value = ''
  beneficiaryEditId.value = beneficiary.id
  beneficiaryForm.name = beneficiary.name || ''
  beneficiaryForm.relationship = beneficiary.relationship || ''
  beneficiaryForm.preferred_colors_text = Array.isArray(beneficiary.preferred_colors)
    ? beneficiary.preferred_colors.join(', ')
    : ''
  beneficiaryForm.preferred_style = beneficiary.preferred_style || ''
  beneficiaryForm.preferred_product_type = beneficiary.preferred_product_type || ''
  beneficiaryForm.budget_min = beneficiary.budget_min ?? ''
  beneficiaryForm.budget_max = beneficiary.budget_max ?? ''
  beneficiaryForm.notes = beneficiary.notes || ''
  beneficiaryDialog.value = true
}

function closeBeneficiaryDialog() {
  beneficiaryDialog.value = false
  beneficiaryEditId.value = null
  resetBeneficiaryForm()
}

function openAddEventDialog() {
  reminderSuccessMessage.value = ''

  if (!beneficiariesStore.list.length) {
    openAddBeneficiaryDialog()
    return
  }

  eventEditId.value = null
  resetEventForm()
  eventDialog.value = true
}

function openEditEventDialog(event) {
  reminderSuccessMessage.value = ''
  eventEditId.value = event.id
  eventForm.beneficiary_id = event.beneficiary_id || ''
  eventForm.event_type = event.event_type || ''
  eventForm.event_date = event.event_date || ''
  eventForm.reminder_days_before = event.reminder_days_before ?? 4
  eventForm.notes = event.notes || ''
  eventDialog.value = true
}

function openAddBeneficiaryFromEvent() {
  beneficiaryDialog.value = true
  beneficiaryEditId.value = null
  resetBeneficiaryForm()
}

function closeEventDialog() {
  eventDialog.value = false
  eventEditId.value = null
  resetEventForm()
}

async function handleProfileSubmit() {
  successMessage.value = ''

  try {
    await profileStore.saveProfile({
      username: profileForm.username,
      first_name: profileForm.first_name,
      last_name: profileForm.last_name,
      birth_date: profileForm.birth_date || null,
      address: profileForm.address,
    })

    syncProfileForm()
    successMessage.value = 'Profilul a fost actualizat cu succes.'
  } catch (error) {}
}

async function handleSaveBeneficiary() {
  reminderSuccessMessage.value = ''

  if (
    !beneficiaryForm.name ||
    !beneficiaryForm.relationship ||
    !beneficiaryForm.preferred_colors_text ||
    !beneficiaryForm.preferred_style ||
    !beneficiaryForm.preferred_product_type ||
    beneficiaryForm.budget_min === '' ||
    beneficiaryForm.budget_max === ''
  ) {
    snackbar.text = 'Completează toate câmpurile obligatorii.'
    snackbar.show = true
    return
  }

  const payload = {
    name: beneficiaryForm.name,
    relationship: beneficiaryForm.relationship,
    preferred_colors: parseColors(beneficiaryForm.preferred_colors_text),
    preferred_style: beneficiaryForm.preferred_style,
    preferred_product_type: beneficiaryForm.preferred_product_type,
    budget_min: Number(beneficiaryForm.budget_min),
    budget_max: Number(beneficiaryForm.budget_max),
    notes: beneficiaryForm.notes || null,
  }

  try {
    const data = beneficiaryEditId.value
      ? await beneficiariesStore.editBeneficiary(beneficiaryEditId.value, payload)
      : await beneficiariesStore.addBeneficiary(payload)

    const wasEdit = !!beneficiaryEditId.value
    closeBeneficiaryDialog()

    if (eventDialog.value && !eventForm.beneficiary_id && data?.id) {
      eventForm.beneficiary_id = data.id
    }

    snackbar.text = wasEdit ? 'Beneficiar actualizat cu succes.' : 'Beneficiar adăugat cu succes.'
    snackbar.show = true
  } catch (error) {}
}

async function handleSaveEvent() {
  reminderSuccessMessage.value = ''

  const payload = {
    beneficiary_id: eventForm.beneficiary_id,
    event_type: eventForm.event_type,
    event_date: eventForm.event_date,
    reminder_days_before:
      eventForm.reminder_days_before === '' || eventForm.reminder_days_before === null
        ? 4
        : Number(eventForm.reminder_days_before),
    notes: eventForm.notes || null,
  }

  try {
    await (eventEditId.value
      ? eventsStore.editEvent(eventEditId.value, payload)
      : eventsStore.addEvent(payload))

    const wasEdit = !!eventEditId.value
    closeEventDialog()

    snackbar.text = wasEdit ? 'Eveniment actualizat cu succes.' : 'Eveniment adăugat cu succes.'
    snackbar.show = true
  } catch (error) {}
}

function handleDeleteBeneficiary(beneficiary) {
  openConfirmDialog({
    title: 'Ștergi acest beneficiar?',
    text: `Beneficiarul "${beneficiary.name}" va fi eliminat din lista ta.`,
    confirmText: 'Șterge',
    cancelText: 'Anulează',
    onConfirm: async () => {
      reminderSuccessMessage.value = ''

      try {
        await beneficiariesStore.removeBeneficiary(beneficiary.id)
        snackbar.text = 'Beneficiar șters cu succes.'
        snackbar.show = true
      } catch (error) {}
    },
  })
}

function handleDeleteEvent(event) {
  openConfirmDialog({
    title: 'Ștergi acest eveniment?',
    text: `Evenimentul "${beautifyEventType(event.event_type)}" pentru ${getBeneficiaryName(event.beneficiary_id)} va fi șters.`,
    confirmText: 'Șterge',
    cancelText: 'Anulează',
    onConfirm: async () => {
      reminderSuccessMessage.value = ''

      try {
        await eventsStore.removeEvent(event.id)
        snackbar.text = 'Eveniment șters cu succes.'
        snackbar.show = true
      } catch (error) {}
    },
  })
}

const invoiceDialog = ref(false)
const selectedInvoiceOrder = ref(null)

function openInvoiceDialog(order) {
  selectedInvoiceOrder.value = order
  invoiceDialog.value = true
}

function formatOrderShortDate(date) {
  return new Date(date).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatOrderStatus(status) {
  const map = {
    pending: 'În procesare',
    confirmed: 'Confirmată',
    paid: 'Plătită',
    delivered: 'Livrată',
    cancelled: 'Anulată',
  }

  return map[status] || status
}

async function handleDownloadInvoice(orderId, invoiceNumber) {
  ordersSuccessMessage.value = ''

  try {
    const blob = await ordersStore.downloadUserInvoice(orderId)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `factura-${invoiceNumber || orderId}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Eroare la descarcarea facturii:', error)
  }
}

function handleCancelOrder(orderId) {
  openConfirmDialog({
    title: 'Anulezi comanda?',
    text: 'Comanda va fi anulată și nu va mai putea fi procesată.',
    confirmText: 'Anulează comanda',
    cancelText: 'Înapoi',
    onConfirm: async () => {
      ordersSuccessMessage.value = ''

      try {
        await ordersStore.cancelUserOrder(orderId)
        ordersSuccessMessage.value = 'Comanda a fost anulata cu succes.'
      } catch (error) {
        console.error('Eroare la anulare:', error)
      }
    },
  })
}

function handleDeleteAccount() {
  openConfirmDialog({
    title: 'Ștergi contul definitiv?',
    text: 'Această acțiune este permanentă. Contul și datele tale nu vor mai putea fi recuperate.',
    confirmText: 'Șterge definitiv',
    cancelText: 'Renunță',
    onConfirm: async () => {
      try {
        await profileStore.removeProfile()
        profileStore.clearProfile()
        localStorage.removeItem('token')
        router.push('/')
      } catch (error) {
        console.error('Eroare la ștergerea contului:', error)
      }
    },
  })
}

watch(
  () => profileStore.profile,
  () => {
    syncProfileForm()
  },
  { deep: true },
)

onMounted(async () => {
  await profileStore.fetchProfile()
  syncProfileForm()

  await Promise.all([
    beneficiariesStore.fetchBeneficiaries(),
    eventsStore.fetchEvents(),
    ordersStore.fetchOrders(),
  ])
})
</script>
